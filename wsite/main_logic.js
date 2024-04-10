/*
Lit-html tag override so we don't have to remove them constantly
Should probably be removed in production, but it's largely harmless
(jquery's html() is called on a selector, so there should be no conflict)
*/
function html(s){return s};
