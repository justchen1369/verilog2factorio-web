let codeTab = {
    button: document.getElementById("codeButton"),
    window: document.getElementById("codeTab")
};
let graphTab = {
    button: document.getElementById("graphButton"),
    window: document.getElementById("graphTab")
};
let blueprintTab = {
    button: document.getElementById("blueprintButton"),
    window: document.getElementById("blueprintTab")
};

let tabs = [codeTab, graphTab, blueprintTab];

let active = codeTab;

function changeTab(tab) {
    active.window.removeAttribute("active");

    active = tab;
    active.window.setAttribute("active", "");
}

for (const tab of tabs) {
    tab.button.addEventListener("click", () => changeTab(tab));
}
