const {preset, color} = require('@tiller-ds/theme');

module.exports = {
    presets: [preset],
    theme: {
        extend: {
            colors: {
                primary: color("rose"),
                secondary: color("slate", {dark: "600"})
            },
            boxShadow: {
                'b': '0px 20px 11px -24px rgba(0,0,0,0.26)',
            }
        }
    },
};
