import { opt_chain } from "./opt_chain.js";
import { opt_clean } from "./opt_clean.js";
import { opt_const } from "./opt_const.js";
import { opt_merge } from "./opt_merge.js";
import { opt_transform } from "./opt_transform.js";
// TODO: idea replace if(c == 1) return const; with c * const
export function optimize(entities) {
    let changed = true;
    while (changed) {
        changed = false;
        // somehow ||= does not work?
        if (opt_const(entities))
            changed = true;
        if (opt_clean(entities))
            changed = true;
        if (opt_merge(entities))
            changed = true;
        if (opt_transform(entities))
            changed = true;
        console.log("");
    }
    opt_chain(entities);
    // for (const e of entities) {
    //     if (isTransformer(e) && e.input.red.length > 0 && e.input.green.length > 0) {
    //         debugger;
    //     }
    // }
    /*

    for (const n of entities) {
        if (!isNop(n)) continue;

        let inRed = nets.red.map.get(n.input);
        let inGreen = nets.green.map.get(n.input);

        let outRed = nets.red.map.get(n.output);
        let outGreen = nets.green.map.get(n.output);

        if (inRed.points.length + inGreen.points.length == 2) {
            debugger
        }
    }*/
    /*let count = 0;
    for (const n of entities) {
        if(isTransformer(n)) {
            count++;
            debugger;
        }
    }
    console.log(count);*/
}
