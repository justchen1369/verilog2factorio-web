/** Removes entities which have no output */
export function opt_clean(entities) {
    let count = 0;
    console.log("Running opt_clean");
    for (let i = 0; i < entities.length; i++) {
        const e = entities[i];
        if (e.keep)
            continue;
        if (e.output.red.size + e.output.green.size == 0) { // output is not connected
            e.delete();
            entities.splice(entities.indexOf(e), 1);
            i--;
            count++;
            continue;
        }
    }
    console.log(`Removed ${count} combinators`);
    return count != 0;
}
