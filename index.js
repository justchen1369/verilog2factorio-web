import {
    buildGraph
} from "./build/parser.js";
import {
    transform
} from "./build/transformer.js";

let collatz = `
module collatz(input clk, input start, input [15:0] data, output reg [15:0] val);
always @(posedge clk) begin
    if(start)
        val <= data; else if(!(val & 1'b1)) val <=val>> 1;
    else
        val <= val * 16'd3 + 16'd1; 
    end 
endmodule
`;

let editor = ace.edit("input");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/verilog");
window.editor = editor;

if (localStorage.getItem("verilog")) {
    editor.setValue(localStorage.getItem("verilog"));
} else {
    editor.setValue(collatz);
}
editor.selection.clearSelection();


editor.session.on("change", (data) => {
    localStorage.setItem("verilog", editor.getValue());
})


function createBlueprint(entityList, name) {
    return {
        item: "blueprint",
        label: name,
        icons: [{
                signal: {
                    type: "item",
                    name: "decider-combinator"
                },
                index: 1
            },
            {
                signal: {
                    type: "item",
                    name: "constant-combinator"
                },
                index: 2
            }
        ],
        entities: entityList,
        version: 281479273447424
    }
}

function createBlueprintBook(blueprints) {
    return {
        item: "blueprint-book",
        blueprints: blueprints.map((blueprint, index) => ({
            index,
            blueprint
        })),
        active_index: 0,
        version: 281479273447424
    }
}

document.getElementById("compile").addEventListener("click", () => {
    compile();
});
const output = document.getElementById("output");

YosysJS.load_viz();
let ys = YosysJS.create("");

function compile() {
    ys.write_file("test.sv", editor.getValue());

    ys.run("design -reset");
    console.log(ys.print_buffer);
    ys.run("read_verilog -sv test.sv");
    console.log(ys.print_buffer);
    if(ys.errmsg) {
        alert(ys.errmsg);
        return;
    }
    ys.run("proc; flatten; wreduce; opt; fsm; opt; memory -nomap; opt; muxpack; peepopt; async2sync; wreduce; opt -mux_bool");
    console.log(ys.print_buffer);
    ys.run("write_json temp.json");
    console.log(ys.print_buffer);
    ys.run("show");
    console.log(ys.print_buffer);

    var dot = ys.read_file('show.dot');
    if (dot) YosysJS.dot_into_svg(dot, 'svg');

    var data = JSON.parse(ys.read_file('temp.json'));

    let blueprints = [];
    console.log(data);
    for (const key in data.modules) {
        const module = data.modules[key];
        let graph = buildGraph(module);

        const entities = transform(graph.nodes);
        blueprints.push(createBlueprint(entities, key));
    }

    let el;
    if (blueprints.length == 1) {
        el = {
            blueprint: blueprints[0]
        };
    } else {
        el = {
            blueprint_book: createBlueprintBook(blueprints)
        };
    }

    output.textContent = "0" + btoa(String.fromCharCode.apply(null, pako.deflate(JSON.stringify(el))));
}