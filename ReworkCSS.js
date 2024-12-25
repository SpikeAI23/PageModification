// Rewrite any CSS rule dynamically
(function rewriteCSS() {
    // Prompt user for input
    const cssToRewrite = prompt("Enter the CSS rules to rewrite (e.g., 'body { background-color: red; }'):", `
        body {
            background-color: #1e1e1e;
            color: #ffffff;
        }
        a {
            color: #ff6347;
        }
    `);

    if (!cssToRewrite) {
        console.log("Operation canceled. No changes were made.");
        return;
    }

    // Parse the user's CSS input into rules
    const parser = new CSSStyleSheet();
    parser.replaceSync(cssToRewrite);

    // Process each rule provided by the user
    parser.cssRules.forEach(newRule => {
        const selector = newRule.selectorText;
        const style = newRule.style;
        let ruleFound = false;

        // Iterate through all stylesheets in the document
        for (const sheet of document.styleSheets) {
            try {
                // Iterate through all CSS rules in the stylesheet
                for (const rule of sheet.cssRules) {
                    // Match rules by selector
                    if (rule.selectorText === selector) {
                        ruleFound = true;
                        // Overwrite existing properties
                        for (const property of style) {
                            rule.style.setProperty(property, style.getPropertyValue(property), style.getPropertyPriority(property));
                        }
                    }
                }
            } catch (e) {
                console.warn("Unable to access stylesheet: ", sheet.href);
            }
        }

        // If no matching rule is found, add a new rule
        if (!ruleFound) {
            try {
                const newRuleText = `${selector} { ${style.cssText} }`;
                for (const sheet of document.styleSheets) {
                    if (sheet.href === null) { // Use inline stylesheets for new rules
                        sheet.insertRule(newRuleText, sheet.cssRules.length);
                        break;
                    }
                }
            } catch (e) {
                console.error("Unable to add new rule: ", e);
            }
        }
    });

    console.log("CSS rules rewritten!");
})();
