// Content script that runs on the MDAC page
console.log('MDAC Form Filler content script loaded on:', window.location.href);

// Signal that content script is ready
window.mdacContentScriptReady = true;

// Test if we're on the right page
if (window.location.href.includes('imigresen-online.imi.gov.my')) {
  console.log('✓ Content script loaded on MDAC website');
} else {
  console.log('⚠️ Content script loaded on wrong website');
}

// Notify that content script is ready
chrome.runtime.sendMessage({
  action: 'contentScriptReady',
  url: window.location.href
}).catch(err => {
  console.log('Background script not ready yet:', err.message);
});

// Helper functions
function setDateField(fieldId, dateValue) {
  const element = document.getElementById(fieldId);
  if (element) {
    // Convert date format from DD/MM/YYYY to YYYY-MM-DD if needed
    let formattedDate = dateValue;
    
    console.log(`Original date value for ${fieldId}:`, dateValue);
    
    // Check if date is in DD/MM/YYYY format
    if (dateValue && typeof dateValue === 'string' && dateValue.includes('/')) {
      const parts = dateValue.split('/');
      if (parts.length === 3 && parts[0].length <= 2) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        formattedDate = `${year}-${month}-${day}`;
        console.log(`Converted ${dateValue} to ${formattedDate}`);
      }
    }
    // Check if date is already in YYYY-MM-DD format
    else if (dateValue && typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      formattedDate = dateValue;
      console.log(`Date already in correct format: ${formattedDate}`);
    }
    // Try to handle other date formats
    else if (dateValue) {
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;
          console.log(`Parsed date ${dateValue} to ${formattedDate}`);
        }
      } catch (e) {
        console.error(`Failed to parse date: ${dateValue}`, e);
      }
    }
    
    console.log(`Setting ${fieldId}: ${dateValue} → ${formattedDate}`);
    element.value = formattedDate;
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Verify the value was set correctly
    const actualValue = element.value;
    if (actualValue !== formattedDate) {
      console.warn(`Date field ${fieldId} value mismatch. Expected: ${formattedDate}, Actual: ${actualValue}`);
    }
    
    return true;
  }
  console.warn(`Date field ${fieldId} not found`);
  return false;
}

function selectOptionByValueOrText(selectElement, value) {
  if (!selectElement || !value) {
    console.error('selectOptionByValueOrText: Invalid parameters', { selectElement, value });
    return false;
  }
  
  const options = selectElement.options;
  value = value.toString().trim();
  
  console.log(`Selecting option "${value}" in select element:`, selectElement.id || selectElement.name || 'unnamed');
  console.log('Available options:', Array.from(options).map(opt => `"${opt.value}" (text: "${opt.text}")`));
  
  // Try by value first
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      selectElement.selectedIndex = i;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✓ Selected by value: "${value}"`);
      return true;
    }
  }
  
  // Try by text content
  for (let i = 0; i < options.length; i++) {
    if (options[i].text.trim() === value) {
      selectElement.selectedIndex = i;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✓ Selected by text: "${value}"`);
      return true;
    }
  }
  
  // Try by substring match
  for (let i = 0; i < options.length; i++) {
    if (options[i].text.toLowerCase().includes(value.toLowerCase())) {
      selectElement.selectedIndex = i;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`✓ Selected by substring match: "${options[i].text}" contains "${value}"`);
      return true;
    }
  }
  
  console.error(`✗ Failed to select "${value}". Available options:`, Array.from(options).map(opt => `"${opt.value}" (text: "${opt.text}")`));
  return false;
}

function validateAndFormatAddress(address) {
  const words = address.split(' ').filter(word => word.length > 0);
  if (words.length < 3) {
    throw new Error('Address must have at least 3 words');
  }
  if (address.length > 100) {
    address = address.substring(0, 100);
  }
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function fillField(fieldId, value) {
  const element = document.getElementById(fieldId);
  if (element) {
    console.log(`Filling ${fieldId} with: "${value}"`);
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Verify the value was set
    const actualValue = element.value;
    if (actualValue !== value) {
      console.warn(`Field ${fieldId} value mismatch. Expected: "${value}", Actual: "${actualValue}"`);
    }
    return true;
  }
  console.error(`Field ${fieldId} not found on page`);
  return false;
}

async function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Main form filling function
async function fillMDACForm(data) {
  try {
    console.log('Starting form fill with data:', data);
    
    const { commonData, currentPerson } = data;
    
    if (!currentPerson) {
      throw new Error('No person data provided');
    }

    // Check if we're on the right page
    if (!document.getElementById('name')) {
      throw new Error('MDAC form not found on this page. Please make sure you\'re on the registration form.');
    }

    console.log('Form elements found, starting to fill...');
    
    // Track success/failure of each field
    const results = {
      success: [],
      failed: []
    };

    // Fill basic information
    console.log('=== Filling basic information ===');
    if (fillField('name', currentPerson.name)) {
      results.success.push('name');
    } else {
      results.failed.push('name');
    }
    
    if (fillField('passNo', currentPerson.passport_no)) {
      results.success.push('passNo');
    } else {
      results.failed.push('passNo');
    }
    
    // Handle nationality selection and wait for region refresh
    console.log('=== Setting nationality ===');
    const nationalitySelect = document.getElementById('nationality');
    if (nationalitySelect) {
      if (selectOptionByValueOrText(nationalitySelect, currentPerson.nationality)) {
        results.success.push('nationality');
        // Wait for region dropdown to refresh after nationality change
        console.log('Waiting for region dropdown to refresh after nationality selection...');
        await new Promise(resolve => setTimeout(resolve, 3000)); // Increased wait time
      } else {
        results.failed.push('nationality');
      }
    } else {
      console.error('Nationality select element not found');
      results.failed.push('nationality (element not found)');
    }
    
    // Fill sex
    console.log('=== Setting gender ===');
    const sexSelect = document.getElementById('sex');
    if (sexSelect) {
      if (selectOptionByValueOrText(sexSelect, currentPerson.sex)) {
        results.success.push('sex');
      } else {
        results.failed.push('sex');
      }
    } else {
      console.error('Sex select element not found');
      results.failed.push('sex (element not found)');
    }
    
    // Fill dates
    console.log('=== Setting dates ===');
    const dateFields = [
      { id: 'dob', value: currentPerson.dob, name: 'Date of Birth' },
      { id: 'passExpDte', value: currentPerson.passport_expiry, name: 'Passport Expiry' },
      { id: 'arrDt', value: commonData.arrival_date, name: 'Arrival Date' },
      { id: 'depDt', value: commonData.departure_date, name: 'Departure Date' }
    ];
    
    for (const dateField of dateFields) {
      if (setDateField(dateField.id, dateField.value)) {
        results.success.push(dateField.name);
      } else {
        results.failed.push(dateField.name);
      }
    }
    
    // Fill email
    console.log('=== Setting email ===');
    if (fillField('email', commonData.email)) {
      results.success.push('email');
    } else {
      results.failed.push('email');
    }
    
    if (fillField('confirmEmail', commonData.email)) {
      results.success.push('confirmEmail');
    } else {
      results.failed.push('confirmEmail');
    }
    
    // Fill mobile information
    console.log('=== Setting mobile ===');
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
      console.log(`Attempting to set region to: "${commonData.mobile_dialing_code}"`);
      console.log('Available region options:', Array.from(regionSelect.options).map((opt, i) => `${i}: "${opt.value}" (text: "${opt.text}")`));
      
      // The MDAC website expects just the numeric code (e.g., "65" for Singapore)
      const dialingCode = commonData.mobile_dialing_code;
      
      if (dialingCode && selectOptionByValueOrText(regionSelect, dialingCode)) {
        console.log(`✓ Successfully set region to: "${dialingCode}"`);
        results.success.push('region');
      } else {
        console.error(`Failed to set region with dialing code: "${dialingCode}"`);
        console.log('Region dropdown may not be populated yet or code not found');
        results.failed.push('region');
      }
    } else {
      console.error('Region select element not found');
      results.failed.push('region (element not found)');
    }
    
    // Clean mobile number (remove any country code or + symbols)
    let cleanMobile = commonData.mobile;
    if (cleanMobile) {
      // Remove any + symbols and leading country codes
      cleanMobile = cleanMobile.replace(/^\+\d{1,3}/, '').replace(/^[\+\s]/, '').trim();
      console.log(`Cleaned mobile number: "${commonData.mobile}" -> "${cleanMobile}"`);
    }
    
    if (fillField('mobile', cleanMobile)) {
      results.success.push('mobile');
    } else {
      results.failed.push('mobile');
    }
    
    // Fill travel information
    console.log('=== Setting travel info ===');
    const travelModeSelect = document.getElementById('trvlMode');
    if (travelModeSelect) {
      if (selectOptionByValueOrText(travelModeSelect, commonData.mode_of_travel)) {
        results.success.push('trvlMode');
      } else {
        results.failed.push('trvlMode');
      }
    } else {
      console.error('Travel mode select element not found');
      results.failed.push('trvlMode (element not found)');
    }
    
    const embarkSelect = document.getElementById('embark');
    if (embarkSelect) {
      if (selectOptionByValueOrText(embarkSelect, commonData.last_port_embarkation)) {
        results.success.push('embark');
      } else {
        results.failed.push('embark');
      }
    } else {
      console.error('Embarkation select element not found');
      results.failed.push('embark (element not found)');
    }
    
    if (fillField('vesselNm', commonData.transport_number)) {
      results.success.push('vesselNm');
    } else {
      results.failed.push('vesselNm');
    }
    
    // Fill accommodation
    console.log('=== Setting accommodation ===');
    
    // Fill accommodation stay/type if provided
    if (commonData.accommodation_stay) {
      const accommodationSelect = document.getElementById('accommodationStay');
      if (accommodationSelect) {
        if (selectOptionByValueOrText(accommodationSelect, commonData.accommodation_stay)) {
          results.success.push('accommodationStay');
        } else {
          results.failed.push('accommodationStay');
        }
      } else {
        console.error('Accommodation stay select element not found');
        results.failed.push('accommodationStay (element not found)');
      }
    }
    
    // Fill accommodation address 1 if provided
    if (commonData.accommodation_address) {
      try {
        const formattedAddress = validateAndFormatAddress(commonData.accommodation_address);
        if (fillField('accommodationAddress1', formattedAddress)) {
          results.success.push('accommodationAddress1');
        } else {
          results.failed.push('accommodationAddress1');
        }
      } catch (e) {
        console.error('Address validation failed:', e.message);
        results.failed.push('accommodationAddress1 (validation failed)');
      }
    }
    
    // Fill accommodation address 2 if provided
    if (commonData.accommodation_address2) {
      try {
        const formattedAddress2 = validateAndFormatAddress(commonData.accommodation_address2);
        if (fillField('accommodationAddress2', formattedAddress2)) {
          results.success.push('accommodationAddress2');
        } else {
          results.failed.push('accommodationAddress2');
        }
      } catch (e) {
        console.warn('Address 2 validation failed:', e.message);
        results.failed.push('accommodationAddress2 (validation failed)');
      }
    }
    
    // Fill state and wait for city refresh
    console.log('=== Setting state ===');
    const stateSelect = document.getElementById('accommodationState');
    if (stateSelect) {
      if (selectOptionByValueOrText(stateSelect, commonData.state)) {
        results.success.push('accommodationState');
        // Wait for city dropdown to refresh
        console.log('Waiting for city dropdown to refresh...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        results.failed.push('accommodationState');
      }
    } else {
      console.error('State select element not found');
      results.failed.push('accommodationState (element not found)');
    }
    
    // Fill city
    console.log('=== Setting city ===');
    const citySelect = document.getElementById('accommodationCity');
    if (citySelect) {
      if (selectOptionByValueOrText(citySelect, commonData.city)) {
        results.success.push('accommodationCity');
      } else {
        results.failed.push('accommodationCity');
      }
    } else {
      console.error('City select element not found');
      results.failed.push('accommodationCity (element not found)');
    }
    
    if (fillField('accommodationPostcode', commonData.postcode)) {
      results.success.push('accommodationPostcode');
    } else {
      results.failed.push('accommodationPostcode');
    }
    
    // Summary
    console.log('=== FORM FILL SUMMARY ===');
    console.log('✓ Successfully filled:', results.success);
    console.log('✗ Failed to fill:', results.failed);
    
    if (results.failed.length > 0) {
      const message = `Form partially filled. Failed fields: ${results.failed.join(', ')}`;
      console.warn(message);
      return { success: false, message };
    } else {
      console.log('Form filling completed successfully');
      return { success: true, message: `Form filled successfully! (${results.success.length} fields)` };
    }
    
  } catch (error) {
    console.error('Error filling form:', error);
    return { success: false, message: error.message };
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'fillForm') {
    console.log('Starting form fill process...');
    fillMDACForm(request.data)
      .then(result => {
        console.log('Form fill result:', result);
        sendResponse(result);
      })
      .catch(error => {
        console.error('Form fill error:', error);
        sendResponse({ success: false, message: error.message });
      });
    return true; // Will respond asynchronously
  }
  
  // Debug region dropdown
  if (request.action === 'debugRegion') {
    console.log('Debug region dropdown requested');
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
      const options = Array.from(regionSelect.options).map((opt, i) => 
        `${i}: value="${opt.value}" text="${opt.text}"`
      ).join('\n');
      
      const message = `Region dropdown found!\nTotal options: ${regionSelect.options.length}\n\n${options}`;
      console.log(message);
      sendResponse({ success: true, message });
    } else {
      const message = 'Region dropdown (ID: region) not found on this page';
      console.log(message);
      sendResponse({ success: false, message });
    }
    return true;
  }
  
  // Test message for debugging
  if (request.action === 'test') {
    console.log('Test message received');
    sendResponse({ success: true, message: 'Content script is working!' });
    return true;
  }
});
