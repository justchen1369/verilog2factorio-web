import * as fs from "fs";
import { exec } from "child_process";
export function genNetlist(files) {
    for (const file of files) {
        if (!fs.existsSync(file)) {
            console.log(`error: file ${file} not found`);
        }
    }
    const commands = "proc; flatten; wreduce; opt; fsm; opt; memory -nomap; opt; muxpack; peepopt; async2sync; wreduce; opt -mux_bool";
    const proc = exec(`yosys -p "${commands}" -o temp.json "${files.join('" "')}"`);
    return new Promise(res => {
        proc.stderr.on("data", (data) => {
            console.log(data);
        });
        proc.on("exit", (code) => {
            if (code != 0) {
                console.log("An error occurred while yosys tried to compile your code.");
                process.exit(code);
            }
            const data = JSON.parse(fs.readFileSync("./temp.json", 'utf8'));
            // fs.unlinkSync("temp.json");
            res(data);
        });
    });
}
