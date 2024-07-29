import React, { useEffect } from 'react';
import './style.scss';

function GTranslate() {
    useEffect(() => {
        // Function to check if a script is already present in the document
        const isScriptLoaded = (id) => !!document.getElementById(id);

        // Only add the settings script if it isn't already present
        if (!isScriptLoaded('gtranslateSettingsScript')) {
            const gtranslateSettingsScript = document.createElement('script');
            gtranslateSettingsScript.id = 'gtranslateSettingsScript';
            gtranslateSettingsScript.innerHTML = `
                window.gtranslateSettings = {
                    "default_language": "en",
                    "native_language_names": "true",
                    "languages": ["en", "ja", "ko", "zh-CN"],
                    "wrapper_selector": ".gtranslate_wrapper"
                };
            `;
            document.body.appendChild(gtranslateSettingsScript);
        }

        // Only add the main GTranslate script if it isn't already present
        if (!isScriptLoaded('gtranslateScript')) {
            const gtranslateScript = document.createElement('script');
            gtranslateScript.id = 'gtranslateScript';
            gtranslateScript.src = "https://cdn.gtranslate.net/widgets/latest/popup.js";
            gtranslateScript.defer = true;
            document.body.appendChild(gtranslateScript);
        }

        return () => {
            // Clean up: Remove the scripts if they were added
            const gtranslateSettingsScript = document.getElementById('gtranslateSettingsScript');
            if (gtranslateSettingsScript) {
                document.body.removeChild(gtranslateSettingsScript);
            }
            const gtranslateScript = document.getElementById('gtranslateScript');
            if (gtranslateScript) {
                document.body.removeChild(gtranslateScript);
            }
        };
    }, []);

    return <div className="gtranslate_wrapper"></div>;
}

export default GTranslate;
