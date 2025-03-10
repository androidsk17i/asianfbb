document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const subjectInput = document.getElementById('subject');
    const ethnicitySelect = document.getElementById('ethnicity');
    const expressionSelect = document.getElementById('expression');
    const clothingSelect = document.getElementById('clothing');
    const sceneSelect = document.getElementById('scene');
    const timeOfDaySelect = document.getElementById('timeOfDay');
    const weatherSelect = document.getElementById('weather');
    const poseSelect = document.getElementById('pose');
    const compositionSelect = document.getElementById('composition');
    const detailsTextarea = document.getElementById('details');
    const highQualityCheckbox = document.getElementById('highQuality');
    const detailedCheckbox = document.getElementById('detailed');
    const softLightingCheckbox = document.getElementById('softLighting');
    const cinematicCheckbox = document.getElementById('cinematic');
    const naturalLightingCheckbox = document.getElementById('naturalLighting');
    const photoRealisticCheckbox = document.getElementById('photoRealistic');
    const hyperDetailedCheckbox = document.getElementById('hyperDetailed');
    const ultraRealisticCheckbox = document.getElementById('ultraRealistic');
    const generateBtn = document.getElementById('generateBtn');
    const randomBtn = document.getElementById('randomBtn');
    const resultTextarea = document.getElementById('result');
    const negativeTextarea = document.getElementById('negative');
    const copyBtn = document.getElementById('copyBtn');
    const copyStatus = document.getElementById('copyStatus');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const promptNameInput = document.getElementById('promptName');
    const savePromptBtn = document.getElementById('savePromptBtn');
    const savedPromptsSelect = document.getElementById('savedPrompts');
    const deletePromptBtn = document.getElementById('deletePromptBtn');

    // Dark mode functionality
    function initDarkMode() {
        // Check for saved preference
        const darkModePref = localStorage.getItem('darkMode');
        if (darkModePref === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }

    // Favorites functionality
    function initFavorites() {
        // Load saved prompts
        loadSavedPrompts();

        // Save prompt
        savePromptBtn.addEventListener('click', function() {
            const promptName = promptNameInput.value.trim();
            if (!promptName) {
                alert('Please enter a name for this prompt');
                return;
            }

            const promptData = {
                name: promptName,
                subject: subjectInput.value,
                ethnicity: ethnicitySelect.value,
                expression: expressionSelect.value,
                clothing: clothingSelect.value,
                scene: sceneSelect.value,
                timeOfDay: timeOfDaySelect.value,
                weather: weatherSelect.value,
                pose: poseSelect.value,
                composition: compositionSelect.value,
                details: detailsTextarea.value,
                highQuality: highQualityCheckbox.checked,
                detailed: detailedCheckbox.checked,
                softLighting: softLightingCheckbox.checked,
                cinematic: cinematicCheckbox.checked,
                naturalLighting: naturalLightingCheckbox.checked,
                photoRealistic: photoRealisticCheckbox.checked,
                hyperDetailed: hyperDetailedCheckbox.checked,
                ultraRealistic: ultraRealisticCheckbox.checked,
                generatedPrompt: resultTextarea.value
            };

            savePrompt(promptName, promptData);
            promptNameInput.value = '';
        });

        // Load prompt
        savedPromptsSelect.addEventListener('change', function() {
            const selectedPrompt = this.value;
            if (selectedPrompt) {
                loadPrompt(selectedPrompt);
            }
        });

        // Delete prompt
        deletePromptBtn.addEventListener('click', function() {
            const selectedPrompt = savedPromptsSelect.value;
            if (selectedPrompt) {
                deletePrompt(selectedPrompt);
            } else {
                alert('Please select a prompt to delete');
            }
        });
    }

    // Save prompt to localStorage
    function savePrompt(name, data) {
        let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '{}');
        savedPrompts[name] = data;
        localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
        loadSavedPrompts(); // Refresh the dropdown
    }

    // Load saved prompts into dropdown
    function loadSavedPrompts() {
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '{}');
        
        // Clear dropdown except for the first option
        while (savedPromptsSelect.options.length > 1) {
            savedPromptsSelect.remove(1);
        }
        
        // Add saved prompts to dropdown
        for (const name in savedPrompts) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            savedPromptsSelect.appendChild(option);
        }
    }

    // Load a specific prompt
    function loadPrompt(name) {
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '{}');
        const promptData = savedPrompts[name];
        
        if (promptData) {
            subjectInput.value = promptData.subject || '';
            
            // Set dropdown values
            setSelectValue(ethnicitySelect, promptData.ethnicity);
            setSelectValue(expressionSelect, promptData.expression);
            setSelectValue(clothingSelect, promptData.clothing);
            setSelectValue(sceneSelect, promptData.scene);
            setSelectValue(timeOfDaySelect, promptData.timeOfDay);
            setSelectValue(weatherSelect, promptData.weather);
            setSelectValue(poseSelect, promptData.pose);
            setSelectValue(compositionSelect, promptData.composition);
            
            // Set text area
            detailsTextarea.value = promptData.details || '';
            
            // Set checkboxes
            highQualityCheckbox.checked = promptData.highQuality || false;
            detailedCheckbox.checked = promptData.detailed || false;
            softLightingCheckbox.checked = promptData.softLighting || false;
            cinematicCheckbox.checked = promptData.cinematic || false;
            naturalLightingCheckbox.checked = promptData.naturalLighting || false;
            photoRealisticCheckbox.checked = promptData.photoRealistic || false;
            hyperDetailedCheckbox.checked = promptData.hyperDetailed || false;
            ultraRealisticCheckbox.checked = promptData.ultraRealistic || false;
            
            // Generate the prompt
            generatePrompt();
        }
    }

    // Helper function to set select value
    function setSelectValue(selectElement, value) {
        if (value) {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === value) {
                    selectElement.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // Delete a saved prompt
    function deletePrompt(name) {
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '{}');
        if (savedPrompts[name]) {
            delete savedPrompts[name];
            localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
            loadSavedPrompts(); // Refresh the dropdown
            savedPromptsSelect.selectedIndex = 0; // Reset to default option
        }
    }

    // Negative prompt for RealisticVisionV60B1_v51HyperVAE.safetensors
    const negativePrompt = "deformed, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, disgusting, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, watermark, watermarked, oversaturated, censored, distorted, deep fried, text, low contrast, low quality, artifacts, signature, cut off, draft, skinny, thin, slim, anorexic, small muscles, underdeveloped muscles, looking at camera, eye contact with viewer, facing viewer, anime, cartoon, drawing, illustration, painting, 3d render, 3d art, videogame, unrealistic, masculine features, masculine face";

    // Set the negative prompt
    negativeTextarea.value = negativePrompt;

    // Candid elements to add to the prompt
    const candidElements = [
        "candid shot",
        "not looking at camera",
        "natural moment",
        "unposed",
        "authentic moment",
        "documentary style",
        "photojournalistic approach"
    ];

    // Photography elements to enhance realism
    const photographyElements = [
        "professional photography",
        "DSLR",
        "Canon EOS",
        "Sony Alpha",
        "Nikon D850",
        "85mm lens",
        "50mm f/1.4",
        "natural lighting",
        "studio lighting",
        "professional color grading",
        "sharp focus",
        "high resolution",
        "photorealistic",
        "hyperrealistic",
        "photographic",
        "award-winning photography"
    ];

    // Skin detail elements to enhance realism
    const skinDetailElements = [
        "smooth skin",
        "flawless skin",
        "porcelain skin",
        "glowing skin",
        "radiant skin",
        "natural skin texture",
        "soft skin",
        "clear complexion",
        "even skin tone",
        "healthy skin",
        "dewy skin",
        "silky skin",
        "luminous skin",
        "perfect skin",
        "realistic skin details",
        "natural skin pores",
        "subtle skin highlights",
        "skin subsurface scattering"
    ];

    // Feminine feature elements
    const feminineElements = [
        "feminine features",
        "feminine face",
        "feminine jawline",
        "soft facial features",
        "delicate features",
        "feminine physique",
        "feminine curves",
        "feminine elegance",
        "feminine beauty",
        "feminine grace",
        "feminine charm",
        "feminine allure",
        "feminine aesthetic",
        "feminine appearance",
        "feminine essence",
        "feminine form",
        "feminine contours",
        "feminine silhouette"
    ];

    // Randomly select a candid element
    function getRandomCandidElement() {
        const randomIndex = Math.floor(Math.random() * candidElements.length);
        return candidElements[randomIndex];
    }

    // Randomly select photography elements
    function getRandomPhotographyElements(count) {
        const shuffled = [...photographyElements].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Randomly select skin detail elements
    function getRandomSkinDetailElements(count) {
        const shuffled = [...skinDetailElements].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Randomly select feminine elements
    function getRandomFeminineElements(count) {
        const shuffled = [...feminineElements].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Random detail options for the random prompt generator
    const randomDetails = [
        "with shoulder-length black hair",
        "with short styled hair",
        "with a sleek ponytail",
        "with natural makeup",
        "with defined facial features",
        "with a confident expression",
        "with massive arms",
        "with bulging muscles",
        "with impressive muscle mass",
        "with thick thighs",
        "with broad shoulders",
        "with a powerful physique",
        "with a towel around neck",
        "with minimal jewelry",
        "with a fitness tracker",
        "with a healthy glow",
        "with visible veins",
        "with a serious expression",
        "with a strong jawline",
        "with huge biceps",
        "with a wide back",
        "age 35-45",
        "heavyweight class",
        "with a stocky build",
        "with tanned skin",
        "with a competition tan",
        "with oiled muscles",
        "with a focused gaze",
        "with a championship medal",
        "with a protein shaker",
        "with wrist wraps",
        "with lifting straps",
        "with a gym bag nearby",
        "with a water bottle",
        "with a muscular neck",
        "with defined abs",
        "with a fitness watch",
        "with a headband",
        "with athletic tape",
        "with a lifting belt",
        "with knee sleeves",
        "with elbow sleeves",
        "with gym chalk on hands",
        "with a muscular back",
        "with defined calves",
        "with a strong core",
        "with a competition number",
        "with a muscular chest",
        "with a fitness armband",
        "with wireless earbuds"
    ];

    // Generate prompt function
    function generatePrompt() {
        // Base prompt with subject and ethnicity
        let prompt = subjectInput.value;
        
        // Add ethnicity
        if (ethnicitySelect.value) {
            prompt = ethnicitySelect.value + " " + prompt;
        }

        // Add feminine elements (1-2)
        const femElements = getRandomFeminineElements(Math.floor(Math.random() * 2) + 1);
        prompt += `, ${femElements.join(', ')}`;

        // Add facial expression
        if (expressionSelect.value) {
            prompt += `, ${expressionSelect.value}`;
        }

        // Add candid element
        prompt += `, ${getRandomCandidElement()}`;

        // Add clothing if selected
        if (clothingSelect.value) {
            prompt += ` wearing ${clothingSelect.value}`;
        }

        // Add pose if selected
        if (poseSelect.value) {
            prompt += `, ${poseSelect.value}`;
        }

        // Add composition if selected
        if (compositionSelect.value) {
            prompt += `, ${compositionSelect.value}`;
        }

        // Add time of day if selected
        if (timeOfDaySelect.value) {
            prompt += `, ${timeOfDaySelect.value}`;
        }

        // Add weather if selected
        if (weatherSelect.value) {
            prompt += `, ${weatherSelect.value}`;
        }

        // Add scene if selected
        if (sceneSelect.value) {
            prompt += `, in a ${sceneSelect.value}`;
        }

        // Add additional details if provided
        if (detailsTextarea.value.trim()) {
            prompt += `, ${detailsTextarea.value.trim()}`;
        }

        // Add skin detail elements (1-2)
        const skinElements = getRandomSkinDetailElements(Math.floor(Math.random() * 2) + 1);
        prompt += `, ${skinElements.join(', ')}`;

        // Add style enhancements
        let styleEnhancements = [];
        
        if (highQualityCheckbox.checked) {
            styleEnhancements.push('high quality');
        }
        
        if (detailedCheckbox.checked) {
            styleEnhancements.push('detailed');
        }
        
        if (softLightingCheckbox.checked) {
            styleEnhancements.push('soft lighting');
        }
        
        if (cinematicCheckbox.checked) {
            styleEnhancements.push('cinematic');
        }

        if (naturalLightingCheckbox.checked) {
            styleEnhancements.push('natural lighting');
        }
        
        if (photoRealisticCheckbox.checked) {
            styleEnhancements.push('photorealistic');
        }
        
        if (hyperDetailedCheckbox.checked) {
            styleEnhancements.push('hyperdetailed');
        }
        
        if (ultraRealisticCheckbox.checked) {
            styleEnhancements.push('ultra-realistic');
        }

        // Add style enhancements to prompt
        if (styleEnhancements.length > 0) {
            prompt += `, ${styleEnhancements.join(', ')}`;
        }

        // Add random photography elements (2-3)
        const photoElements = getRandomPhotographyElements(Math.floor(Math.random() * 2) + 2);
        prompt += `, ${photoElements.join(', ')}`;

        // Add model-specific prompt for RealisticVisionV60B1_v51HyperVAE.safetensors with enhanced realism
        prompt += ', realistic, photorealistic, 8k, RAW photo, highly detailed skin, lifelike, ultra-realistic, professional photo, sharp focus, high resolution, color grading, hyperdetailed, intricate details, perfect composition, feminine beauty';

        // Display the generated prompt
        resultTextarea.value = prompt;
        
        // Auto-copy to clipboard
        autoCopyToClipboard();
    }

    // Function to generate a random prompt
    function generateRandomPrompt() {
        // Randomly select options from dropdowns
        const randomEthnicityIndex = Math.floor(Math.random() * ethnicitySelect.options.length);
        const randomExpressionIndex = Math.floor(Math.random() * expressionSelect.options.length);
        const randomClothingIndex = Math.floor(Math.random() * clothingSelect.options.length);
        const randomSceneIndex = Math.floor(Math.random() * sceneSelect.options.length);
        const randomTimeIndex = Math.floor(Math.random() * timeOfDaySelect.options.length);
        const randomWeatherIndex = Math.floor(Math.random() * weatherSelect.options.length);
        const randomPoseIndex = Math.floor(Math.random() * poseSelect.options.length);
        const randomCompositionIndex = Math.floor(Math.random() * compositionSelect.options.length);
        
        // Set the random selections
        ethnicitySelect.selectedIndex = randomEthnicityIndex;
        expressionSelect.selectedIndex = randomExpressionIndex;
        clothingSelect.selectedIndex = randomClothingIndex;
        sceneSelect.selectedIndex = randomSceneIndex;
        timeOfDaySelect.selectedIndex = randomTimeIndex;
        weatherSelect.selectedIndex = randomWeatherIndex;
        poseSelect.selectedIndex = randomPoseIndex;
        compositionSelect.selectedIndex = randomCompositionIndex;
        
        // Add 1-2 random details from the general details list
        const numDetails = Math.floor(Math.random() * 2) + 1;
        let selectedDetails = [];
        
        for (let i = 0; i < numDetails; i++) {
            const randomDetailIndex = Math.floor(Math.random() * randomDetails.length);
            const detail = randomDetails[randomDetailIndex];
            
            // Avoid duplicates
            if (!selectedDetails.includes(detail)) {
                selectedDetails.push(detail);
            }
        }
        
        detailsTextarea.value = selectedDetails.join(', ');
        
        // Randomize checkboxes
        highQualityCheckbox.checked = Math.random() > 0.2; // 80% chance to be checked
        detailedCheckbox.checked = Math.random() > 0.2;    // 80% chance to be checked
        softLightingCheckbox.checked = Math.random() > 0.5; // 50% chance to be checked
        cinematicCheckbox.checked = Math.random() > 0.5;   // 50% chance to be checked
        naturalLightingCheckbox.checked = Math.random() > 0.5; // 50% chance to be checked
        photoRealisticCheckbox.checked = Math.random() > 0.2; // 80% chance to be checked
        hyperDetailedCheckbox.checked = Math.random() > 0.5; // 50% chance to be checked
        ultraRealisticCheckbox.checked = Math.random() > 0.3; // 70% chance to be checked
        
        // Generate the prompt with these random selections
        generatePrompt();
        
        // Add visual feedback for the random button
        randomBtn.textContent = 'Randomized!';
        setTimeout(() => {
            randomBtn.textContent = 'Random Prompt';
        }, 1000);
    }

    // Auto-copy to clipboard function
    function autoCopyToClipboard() {
        resultTextarea.select();
        document.execCommand('copy');
        
        // Show the copy status
        copyStatus.classList.add('visible');
        
        // Hide the status after 2 seconds
        setTimeout(() => {
            copyStatus.classList.remove('visible');
        }, 2000);
    }

    // Manual copy to clipboard function
    function copyToClipboard() {
        resultTextarea.select();
        document.execCommand('copy');
        
        // Visual feedback for copy action
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }

    // Initialize features
    initDarkMode();
    initFavorites();

    // Event listeners
    generateBtn.addEventListener('click', generatePrompt);
    randomBtn.addEventListener('click', generateRandomPrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    subjectInput.addEventListener('input', generatePrompt);

    // Update prompt when any input changes
    const allInputs = [
        ethnicitySelect, expressionSelect, clothingSelect, sceneSelect, 
        timeOfDaySelect, weatherSelect, poseSelect, compositionSelect, 
        detailsTextarea, highQualityCheckbox, detailedCheckbox, 
        softLightingCheckbox, cinematicCheckbox, naturalLightingCheckbox, 
        photoRealisticCheckbox, hyperDetailedCheckbox, ultraRealisticCheckbox
    ];
    
    allInputs.forEach(input => {
        input.addEventListener('change', generatePrompt);
    });

    // For textarea, also listen for keyup events
    detailsTextarea.addEventListener('keyup', generatePrompt);

    // Generate initial prompt on page load
    generatePrompt();
}); 