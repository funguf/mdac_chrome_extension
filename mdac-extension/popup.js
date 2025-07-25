// Popup script for managing form data and triggering form fills
let people = [];
let currentPersonIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Add initial person first (before loading data)
  if (people.length === 0) {
    addPerson();
  }
  
  // Then load saved data on popup open (check for any existing saved data)
  chrome.storage.local.get(['mdacFormData'], function(result) {
    if (result.mdacFormData) {
      populateFormData(result.mdacFormData);
    }
  });
  
  // Add event listeners
  document.getElementById('addPerson').addEventListener('click', addPerson);
  document.getElementById('exportYaml').addEventListener('click', exportToYaml);
  document.getElementById('importYaml').addEventListener('click', () => {
    document.getElementById('yamlFileInput').click();
  });
  document.getElementById('yamlFileInput').addEventListener('change', importFromYaml);
  document.getElementById('openMdacPage').addEventListener('click', openMdacPage);
});

function addPerson() {
  const container = document.getElementById('peopleContainer');
  const personIndex = people.length;
  
  const personDiv = document.createElement('div');
  personDiv.className = 'person-entry';
  personDiv.setAttribute('data-person-index', personIndex);
  personDiv.innerHTML = `
    <button type="button" class="remove-person">Remove</button>
    <h4>Person ${personIndex + 1}</h4>
    <input type="text" class="person-name" placeholder="Full Name" required>
    <input type="text" class="person-passport" placeholder="Passport Number" required>
    <select class="person-nationality">
      <option value="">Select Nationality</option>
      <option value="AFG">AFG - AFGHANISTAN</option>
      <option value="ALB">ALB - ALBANIA</option>
      <option value="DZA">DZA - ALGERIA</option>
      <option value="ASM">ASM - AMERICAN SAMOA</option>
      <option value="AND">AND - ANDORRA</option>
      <option value="AGO">AGO - ANGOLA</option>
      <option value="AIA">AIA - ANGUILLA</option>
      <option value="ATA">ATA - ANTARCTICA</option>
      <option value="ATG">ATG - ANTIGUA AND BARBUDA</option>
      <option value="ARG">ARG - ARGENTINA</option>
      <option value="ARM">ARM - ARMENIA</option>
      <option value="ABW">ABW - ARUBA</option>
      <option value="AUS">AUS - AUSTRALIA</option>
      <option value="AUT">AUT - AUSTRIA</option>
      <option value="AZE">AZE - AZERBAIJAN</option>
      <option value="BHS">BHS - BAHAMAS</option>
      <option value="BHR">BHR - BAHRAIN</option>
      <option value="BGD">BGD - BANGLADESH</option>
      <option value="BRB">BRB - BARBADOS</option>
      <option value="BLR">BLR - BELARUS</option>
      <option value="BEL">BEL - BELGIUM</option>
      <option value="BLZ">BLZ - BELIZE</option>
      <option value="BEN">BEN - BENIN</option>
      <option value="BMU">BMU - BERMUDA</option>
      <option value="BTN">BTN - BHUTAN</option>
      <option value="BOL">BOL - BOLIVIA</option>
      <option value="BIH">BIH - BOSNIA AND HERZEGOVINA</option>
      <option value="BWA">BWA - BOTSWANA</option>
      <option value="BVT">BVT - BOUVET ISLAND</option>
      <option value="BRA">BRA - BRAZIL</option>
      <option value="IOT">IOT - BRITISH INDIAN OCEAN TERRITORY</option>
      <option value="GBN">GBN - BRITISH NATIONAL OVERSEAS</option>
      <option value="GBO">GBO - BRITISH OVERSEAS CITIZENS</option>
      <option value="GBP">GBP - BRITISH PROTECTED PERSON</option>
      <option value="GBS">GBS - BRITISH SUBJECT</option>
      <option value="BRN">BRN - BRUNEI DARUSSALAM</option>
      <option value="BGR">BGR - BULGARIA</option>
      <option value="BFA">BFA - BURKINA FASO</option>
      <option value="BDI">BDI - BURUNDI</option>
      <option value="KHM">KHM - CAMBODIA</option>
      <option value="CMR">CMR - CAMEROON</option>
      <option value="CAN">CAN - CANADA</option>
      <option value="CPV">CPV - CAPE VERDE</option>
      <option value="CYM">CYM - CAYMAN ISLANDS</option>
      <option value="CAF">CAF - CENTRAL AFRICAN REPUBLIC</option>
      <option value="TCD">TCD - CHAD</option>
      <option value="CHL">CHL - CHILE</option>
      <option value="CHN">CHN - CHINA</option>
      <option value="CXR">CXR - CHRISTMAS ISLAND</option>
      <option value="CCK">CCK - COCOS ISLANDS</option>
      <option value="COL">COL - COLOMBIA</option>
      <option value="COM">COM - COMOROS</option>
      <option value="COG">COG - CONGO</option>
      <option value="COK">COK - COOK ISLANDS</option>
      <option value="CRI">CRI - COSTA RICA</option>
      <option value="CIV">CIV - COTE D'IVOIRE</option>
      <option value="HRV">HRV - CROATIA</option>
      <option value="CUB">CUB - CUBA</option>
      <option value="CYP">CYP - CYPRUS</option>
      <option value="CZE">CZE - CZECH REPUBLIC</option>
      <option value="PRK">PRK - DEMOCRATIC PEOPLE'S REPUBLIC OF KOREA</option>
      <option value="DPR">DPR - DEMOCRATIC PEOPLES REPUBLIC OF KOREA</option>
      <option value="COD">COD - DEMOCRATIC REPUBLIC OF THE CONGO</option>
      <option value="DNK">DNK - DENMARK</option>
      <option value="DJI">DJI - DJIBOUTI</option>
      <option value="DMA">DMA - DOMINICA</option>
      <option value="DOM">DOM - DOMINICAN REPUBLIC</option>
      <option value="ECU">ECU - ECUADOR</option>
      <option value="EGY">EGY - EGYPT</option>
      <option value="SLV">SLV - EL SALVADOR</option>
      <option value="GNQ">GNQ - EQUATORIAL GUINEA</option>
      <option value="ERI">ERI - ERITREA</option>
      <option value="EST">EST - ESTONIA</option>
      <option value="ETH">ETH - ETHIOPIA</option>
      <option value="EUE">EUE - EUROPEAN UNION LAISSER PASSER</option>
      <option value="FLK">FLK - FALKLAND ISLAND (MALVINAS)</option>
      <option value="FRO">FRO - FAROE ISLANDS</option>
      <option value="FJI">FJI - FIJI</option>
      <option value="FIN">FIN - FINLAND</option>
      <option value="FXX">FXX - FINLAND, METROPOLITAN</option>
      <option value="FRA">FRA - FRANCE</option>
      <option value="GUF">GUF - FRENCH GUIANA</option>
      <option value="PYF">PYF - FRENCH POLYNESIA</option>
      <option value="ATF">ATF - FRENCH SOUTHERN TERRITORIES</option>
      <option value="GAB">GAB - GABON</option>
      <option value="GMB">GMB - GAMBIA</option>
      <option value="GEO">GEO - GEORGIA</option>
      <option value="DGR">DGR - GERMANY</option>
      <option value="DEU">DEU - GERMANY</option>
      <option value="GHA">GHA - GHANA</option>
      <option value="GIB">GIB - GIBRALTAR</option>
      <option value="GRC">GRC - GREECE</option>
      <option value="GRL">GRL - GREENLAND</option>
      <option value="GRD">GRD - GRENADA</option>
      <option value="GLP">GLP - GUADELOUPE</option>
      <option value="GUM">GUM - GUAM</option>
      <option value="GTM">GTM - GUATEMALA</option>
      <option value="GNB">GNB - GUIENA-BISSAU</option>
      <option value="GIN">GIN - GUINEA</option>
      <option value="GUY">GUY - GUYANA</option>
      <option value="HTI">HTI - HAITI</option>
      <option value="HMD">HMD - HEARD AND MCDONALD ISLANDS</option>
      <option value="VAT">VAT - HOLY SEE (VATICAN CITY STATE)</option>
      <option value="HND">HND - HONDURAS</option>
      <option value="HKG">HKG - HONG KONG</option>
      <option value="HUN">HUN - HUNGARY</option>
      <option value="ISL">ISL - ICELAND</option>
      <option value="IND">IND - INDIA</option>
      <option value="IDN">IDN - INDONESIA</option>
      <option value="IRN">IRN - IRAN</option>
      <option value="IRQ">IRQ - IRAQ</option>
      <option value="IRL">IRL - IRELAND</option>
      <option value="ISR">ISR - ISRAEL</option>
      <option value="ITA">ITA - ITALY</option>
      <option value="JAM">JAM - JAMAICA</option>
      <option value="JPN">JPN - JAPAN</option>
      <option value="JOR">JOR - JORDAN</option>
      <option value="KAZ">KAZ - KAZAKHSTAN</option>
      <option value="KEN">KEN - KENYA</option>
      <option value="KIR">KIR - KIRIBATI</option>
      <option value="KWT">KWT - KUWAIT</option>
      <option value="KGZ">KGZ - KYRGYZSTAN</option>
      <option value="LAO">LAO - LAO PDR</option>
      <option value="LVA">LVA - LATVIA</option>
      <option value="LBN">LBN - LEBANON</option>
      <option value="LSO">LSO - LESOTHO</option>
      <option value="LBR">LBR - LIBERIA</option>
      <option value="LBY">LBY - LIBYA</option>
      <option value="LIE">LIE - LIECHTENSTEIN</option>
      <option value="LTU">LTU - LITHUANIA</option>
      <option value="LUX">LUX - LUXEMBOURG</option>
      <option value="MAC">MAC - MACAU</option>
      <option value="MDG">MDG - MADAGASCAR</option>
      <option value="MWI">MWI - MALAWI</option>
      <option value="MYS">MYS - MALAYSIA</option>
      <option value="MDV">MDV - MALDIVES</option>
      <option value="MLI">MLI - MALI</option>
      <option value="MLT">MLT - MALTA</option>
      <option value="MHL">MHL - MARSHALL ISLANDS</option>
      <option value="MTQ">MTQ - MARTINIQUE</option>
      <option value="MRT">MRT - MAURITANIA</option>
      <option value="MUS">MUS - MAURITIUS</option>
      <option value="MYT">MYT - MAYOTTE</option>
      <option value="MEX">MEX - MEXICO</option>
      <option value="FSM">FSM - MICRONESIA,FEDERATED STATES OF</option>
      <option value="MCO">MCO - MONACO</option>
      <option value="MNG">MNG - MONGOLIA</option>
      <option value="MNE">MNE - MONTENEGRO</option>
      <option value="MSR">MSR - MONTSERRAT</option>
      <option value="MAR">MAR - MOROCCO</option>
      <option value="MOZ">MOZ - MOZAMBIQUE</option>
      <option value="MMR">MMR - MYANMAR</option>
      <option value="NAM">NAM - NAMIBIA</option>
      <option value="NRU">NRU - NAURU</option>
      <option value="NNS">NNS - NEGARA-NEGARA SUMBER</option>
      <option value="NPL">NPL - NEPAL</option>
      <option value="NLD">NLD - NETHERLANDS</option>
      <option value="ANT">ANT - NETHERLANDS ANTILLES</option>
      <option value="NTZ">NTZ - NEUTRAL ZONE</option>
      <option value="NCL">NCL - NEW CELEDONIA</option>
      <option value="NZL">NZL - NEW ZEALAND</option>
      <option value="NIC">NIC - NICARAGUA</option>
      <option value="NER">NER - NIGER</option>
      <option value="NGA">NGA - NIGERIA</option>
      <option value="ZZD">ZZD - NIL</option>
      <option value="NIU">NIU - NIUE</option>
      <option value="NFK">NFK - NORFOLK ISLAND</option>
      <option value="MNP">MNP - NORTHERN MARIANA ISLANDS</option>
      <option value="NOR">NOR - NORWAY</option>
      <option value="OMN">OMN - OMAN</option>
      <option value="PAK">PAK - PAKISTAN</option>
      <option value="PLW">PLW - PALAU</option>
      <option value="PAL">PAL - PALESTINE</option>
      <option value="PSE">PSE - PALESTINE</option>
      <option value="PAN">PAN - PANAMA</option>
      <option value="PNG">PNG - PAPUA NEW GUINEA</option>
      <option value="PRY">PRY - PARAGUAY</option>
      <option value="PER">PER - PERU</option>
      <option value="PHL">PHL - PHILIPPINES</option>
      <option value="PCN">PCN - PITCAIRN ISLAND</option>
      <option value="POL">POL - POLAND</option>
      <option value="PRT">PRT - PORTUGAL</option>
      <option value="PRI">PRI - PUERTO RICO</option>
      <option value="QAT">QAT - QATAR</option>
      <option value="XXC">XXC - REFUGEE</option>
      <option value="XXB">XXB - REFUGEE ARTICLE 1/1951</option>
      <option value="MDA">MDA - REP OF MOLDOVA</option>
      <option value="RKS">RKS - REP. KOSOVO</option>
      <option value="KOR">KOR - REPUBLIC OF KOREA</option>
      <option value="KOS">KOS - REPUBLIC OF KOSOVO</option>
      <option value="MKD">MKD - REPUBLIC OF MACEDONIA</option>
      <option value="ROS">ROS - REPUBLIC OF SOMALILAND</option>
      <option value="SSD">SSD - REPUBLIC OF SOUTH SUDAN</option>
      <option value="REU">REU - REUNION</option>
      <option value="ROM">ROM - ROMANIA</option>
      <option value="ROU">ROU - ROMANIA</option>
      <option value="RUS">RUS - RUSSIA</option>
      <option value="RWA">RWA - RWANDA</option>
      <option value="SHN">SHN - SAINT HELENA</option>
      <option value="KNA">KNA - SAINT KITTS AND NEVIS</option>
      <option value="LCA">LCA - SAINT LUCIA</option>
      <option value="SPM">SPM - SAINT PIERRE AND MIQUELON</option>
      <option value="VCT">VCT - SAINT VINCENT AND THE GRENADINES</option>
      <option value="WSM">WSM - SAMOA</option>
      <option value="SMR">SMR - SAN MARINO</option>
      <option value="STP">STP - SAO TOME AND PRINCIPE</option>
      <option value="SAU">SAU - SAUDI ARABIA</option>
      <option value="SEN">SEN - SENEGAL</option>
      <option value="SER">SER - SERBIA</option>
      <option value="SRB">SRB - SERBIA</option>
      <option value="SCG">SCG - SERBIA AND MONTENEGRO</option>
      <option value="SYC">SYC - SEYCHELLES</option>
      <option value="SLE">SLE - SIERRA LEONE</option>
      <option value="SGP">SGP - SINGAPORE</option>
      <option value="SVK">SVK - SLOVAKIA</option>
      <option value="SVN">SVN - SLOVENIA</option>
      <option value="SLB">SLB - SOLOMON ISLANDS</option>
      <option value="SOM">SOM - SOMALIA</option>
      <option value="ZAF">ZAF - SOUTH AFRICA</option>
      <option value="SGS">SGS - SOUTH GEORGIA & THE SOUTH SANDWICH IS</option>
      <option value="ESP">ESP - SPAIN</option>
      <option value="LKA">LKA - SRI LANKA</option>
      <option value="ZZA">ZZA - STATELESS</option>
      <option value="XXA">XXA - STATELESS PERSON ARTICLE 1/1954</option>
      <option value="SDN">SDN - SUDAN</option>
      <option value="SUR">SUR - SURINAME</option>
      <option value="SJM">SJM - SVALBARD AND JAN MAYEN ISLANDS</option>
      <option value="SWZ">SWZ - SWAZILAND</option>
      <option value="SWE">SWE - SWEDEN</option>
      <option value="CHE">CHE - SWITZERLAND</option>
      <option value="SYR">SYR - SYRIA</option>
      <option value="TWN">TWN - TAIWAN</option>
      <option value="TJK">TJK - TAJIKISTAN</option>
      <option value="TZA">TZA - TANZANIA</option>
      <option value="THA">THA - THAILAND</option>
      <option value="FYR">FYR - THE FORMER YUGOSLAV REP. OF MACEDONIA</option>
      <option value="ZZB">ZZB - TIDAK DINYATAKAN OLEH KLN</option>
      <option value="TLS">TLS - TIMOR LESTE</option>
      <option value="TMP">TMP - TIMOR LESTE</option>
      <option value="TGO">TGO - TOGO</option>
      <option value="TKL">TKL - TOKELAU</option>
      <option value="TON">TON - TONGA</option>
      <option value="TTO">TTO - TRINIDAD AND TOBAGO</option>
      <option value="TUN">TUN - TUNISIA</option>
      <option value="TUR">TUR - TURKEY</option>
      <option value="TKM">TKM - TURKMENISTAN</option>
      <option value="TCA">TCA - TURKS AND CAICOS ISLANDS</option>
      <option value="TUV">TUV - TUVALU</option>
      <option value="UGA">UGA - UGANDA</option>
      <option value="GBD">GBD - UK-DEPENDENT</option>
      <option value="UKR">UKR - UKRAINE</option>
      <option value="UNA">UNA - UN SPECIALIZED AGENCY</option>
      <option value="UNH">UNH - UNHCR</option>
      <option value="ARE">ARE - UNITED ARAB EMIRATES</option>
      <option value="GBR">GBR - UNITED KINGDOM</option>
      <option value="UNO">UNO - UNITED NATIONS ORGANIZATION</option>
      <option value="UMI">UMI - UNITED STATES MINOR OUTLYING ISLANDS</option>
      <option value="ZZZ">ZZZ - UNKNOWN</option>
      <option value="ESH">ESH - UNKNOWN / UNSPECIFIED NATIONALITY</option>
      <option value="XXX">XXX - UNSPECIFIED NATIONALITY</option>
      <option value="URY">URY - URUGUAY</option>
      <option value="USA">USA - USA</option>
      <option value="UZB">UZB - UZBEKISTAN</option>
      <option value="VUT">VUT - VANUATU</option>
      <option value="VEN">VEN - VENEZUELA</option>
      <option value="VNM">VNM - VIETNAM</option>
      <option value="VGB">VGB - VIRGIN ISLANDS (BRITISH)</option>
      <option value="VIR">VIR - VIRGIN ISLANDS (USA)</option>
      <option value="WLF">WLF - WALLIS AND FUTURA ISLANDS</option>
      <option value="YEM">YEM - YEMEN</option>
      <option value="YUG">YUG - YUGOSLAVIA</option>
      <option value="ZAR">ZAR - ZAIRE</option>
      <option value="ZMB">ZMB - ZAMBIA</option>
      <option value="ZWE">ZWE - ZIMBABWE</option>
      <option value="ZIM">ZIM - ZIMBABWE</option>
    </select>
    <select class="person-sex">
      <option value="">Select Gender</option>
      <option value="MALE">Male</option>
      <option value="FEMALE">Female</option>
    </select>
    <label>Date of Birth:</label>
    <input type="date" class="person-dob" required>
    <label>Passport Expiry:</label>
    <input type="date" class="person-passport-expiry" required>
    <button type="button" class="fill-person-btn">Fill Form for This Person</button>
  `;
  
  // Add event listeners without inline handlers
  const removeBtn = personDiv.querySelector('.remove-person');
  removeBtn.addEventListener('click', () => removePerson(personIndex));
  
  const fillBtn = personDiv.querySelector('.fill-person-btn');
  fillBtn.addEventListener('click', () => fillPersonForm(personIndex));
  
  container.appendChild(personDiv);
  people.push({});
}

function removePerson(index) {
  const container = document.getElementById('peopleContainer');
  const personDivs = container.querySelectorAll('.person-entry');
  if (personDivs.length > 1) {
    personDivs[index].remove();
    people.splice(index, 1);
    updatePersonIndices();
  } else {
    alert('You must have at least one person.');
  }
}

function updatePersonIndices() {
  const container = document.getElementById('peopleContainer');
  const personDivs = container.querySelectorAll('.person-entry');
  personDivs.forEach((div, index) => {
    const title = div.querySelector('h4');
    title.textContent = `Person ${index + 1}`;
    
    div.setAttribute('data-person-index', index);
    
    // Update event listeners
    const removeBtn = div.querySelector('.remove-person');
    removeBtn.replaceWith(removeBtn.cloneNode(true)); // Remove old listeners
    const newRemoveBtn = div.querySelector('.remove-person');
    newRemoveBtn.addEventListener('click', () => removePerson(index));
    
    const fillBtn = div.querySelector('.fill-person-btn');
    fillBtn.replaceWith(fillBtn.cloneNode(true)); // Remove old listeners
    const newFillBtn = div.querySelector('.fill-person-btn');
    newFillBtn.addEventListener('click', () => fillPersonForm(index));
  });
}

function collectFormData() {
  // Helper function to ensure date is in YYYY-MM-DD format
  function formatDate(dateStr) {
    if (!dateStr) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // If in DD/MM/YYYY format, convert
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3 && parts[0].length <= 2) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    
    // Try to parse as Date object
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {
      console.error('Failed to parse date:', dateStr);
    }
    
    return dateStr; // Return original if can't parse
  }
  
  // Helper function to get selected value from dropdown
  function getSelectValue(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`DEBUG: Element ${elementId} found, selectedIndex: ${element.selectedIndex}`);
      if (element.selectedIndex >= 0) {
        const selectedValue = element.options[element.selectedIndex].value;
        console.log(`Collected ${elementId}: "${selectedValue}" (from option text: "${element.options[element.selectedIndex].text}")`);
        return selectedValue;
      } else {
        console.warn(`No option selected for ${elementId}`);
        return '';
      }
    }
    console.error(`Select element ${elementId} not found in DOM`);
    return '';
  }
  
  // Collect common data
  const commonData = {
    email: document.getElementById('email').value || '',
    mobile: document.getElementById('mobile').value || '',
    mobile_dialing_code: getSelectValue('mobileDialingCode'),
    arrival_date: formatDate(document.getElementById('arrivalDate').value || ''),
    departure_date: formatDate(document.getElementById('departureDate').value || ''),
    mode_of_travel: getSelectValue('modeOfTravel'),
    last_port_embarkation: document.getElementById('lastPortEmbarkation').value || '',
    transport_number: document.getElementById('transportNumber').value || '',
    accommodation_stay: getSelectValue('accommodationStay'),
    accommodation_address: document.getElementById('accommodationAddress').value || '',
    accommodation_address2: document.getElementById('accommodationAddress2').value || '',
    state: getSelectValue('state'),
    city: document.getElementById('city').value || '',
    postcode: document.getElementById('postcode').value || ''
  };
  
  // Collect people data
  const peopleData = [];
  const personDivs = document.querySelectorAll('.person-entry');
  
  personDivs.forEach((div, index) => {
    // Helper function to get select value from within a person div
    function getPersonSelectValue(className) {
      const element = div.querySelector(`.${className}`);
      if (element) {
        console.log(`DEBUG: Person ${index + 1} element ${className} found, selectedIndex: ${element.selectedIndex}`);
        if (element.selectedIndex >= 0) {
          const selectedValue = element.options[element.selectedIndex].value;
          console.log(`Person ${index + 1} ${className}: "${selectedValue}" (from option text: "${element.options[element.selectedIndex].text}")`);
          return selectedValue;
        } else {
          console.warn(`Person ${index + 1} no option selected for ${className}`);
          return '';
        }
      }
      console.error(`Person ${index + 1} select element ${className} not found`);
      return '';
    }
    
    const person = {
      name: div.querySelector('.person-name').value || '',
      passport_no: div.querySelector('.person-passport').value || '',
      nationality: getPersonSelectValue('person-nationality'),
      sex: getPersonSelectValue('person-sex'),
      dob: formatDate(div.querySelector('.person-dob').value || ''),
      passport_expiry: formatDate(div.querySelector('.person-passport-expiry').value || '')
    };
    peopleData.push(person);
  });
  
  console.log('Collected form data:', { commonData, people: peopleData });
  return { commonData, people: peopleData };
}

function populateFormData(data) {
  // Helper function to ensure date is in YYYY-MM-DD format for HTML inputs
  function ensureHtmlDateFormat(dateStr) {
    if (!dateStr) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // If in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3 && parts[0].length <= 2) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    
    return dateStr;
  }
  
  // Helper function to set select dropdown value
  function setSelectValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value) {
      console.log(`DEBUG: Setting ${elementId} to "${value}". Element has ${element.options.length} options.`);
      // Find the option with matching value
      for (let i = 0; i < element.options.length; i++) {
        if (element.options[i].value === value) {
          element.selectedIndex = i;
          console.log(`✓ Set ${elementId} to: "${value}"`);
          return true;
        }
      }
      console.warn(`✗ Option "${value}" not found in ${elementId}. Available options:`, 
        Array.from(element.options).map(opt => `"${opt.value}"`));
      return false;
    }
    if (!element) {
      console.error(`✗ Element ${elementId} not found in DOM`);
    }
    return false;
  }
  
  // Populate common data
  if (data.commonData) {
    const commonData = data.commonData;
    console.log('Populating common data:', commonData);
    document.getElementById('email').value = commonData.email || '';
    document.getElementById('mobile').value = commonData.mobile || '';
    console.log('About to set mobile dialing code to:', commonData.mobile_dialing_code);
    setSelectValue('mobileDialingCode', commonData.mobile_dialing_code);
    document.getElementById('arrivalDate').value = ensureHtmlDateFormat(commonData.arrival_date || '');
    document.getElementById('departureDate').value = ensureHtmlDateFormat(commonData.departure_date || '');
    setSelectValue('modeOfTravel', commonData.mode_of_travel);
    document.getElementById('lastPortEmbarkation').value = commonData.last_port_embarkation || '';
    document.getElementById('transportNumber').value = commonData.transport_number || '';
    setSelectValue('accommodationStay', commonData.accommodation_stay);
    document.getElementById('accommodationAddress').value = commonData.accommodation_address || '';
    document.getElementById('accommodationAddress2').value = commonData.accommodation_address2 || '';
    setSelectValue('state', commonData.state);
    document.getElementById('city').value = commonData.city || '';
    document.getElementById('postcode').value = commonData.postcode || '';
  }
  
  // Populate people data
  if (data.people && data.people.length > 0) {
    // Clear existing people
    const container = document.getElementById('peopleContainer');
    container.innerHTML = '';
    people = [];
    
    // Add people from data
    data.people.forEach((person, index) => {
      addPerson();
      const personDiv = container.children[index];
      
      // Helper function to set select value within a person div
      function setPersonSelectValue(className, value) {
        const element = personDiv.querySelector(`.${className}`);
        if (element && value) {
          console.log(`DEBUG: Setting person ${index + 1} ${className} to "${value}". Element has ${element.options.length} options.`);
          for (let i = 0; i < element.options.length; i++) {
            if (element.options[i].value === value) {
              element.selectedIndex = i;
              console.log(`✓ Set person ${index + 1} ${className} to: "${value}"`);
              return true;
            }
          }
          console.warn(`✗ Person ${index + 1}: Option "${value}" not found in ${className}. Available options:`, 
            Array.from(element.options).map(opt => `"${opt.value}"`));
          return false;
        }
        if (!element) {
          console.error(`✗ Person ${index + 1}: Element .${className} not found in person div`);
        }
        return false;
      }
      
      personDiv.querySelector('.person-name').value = person.name || '';
      personDiv.querySelector('.person-passport').value = person.passport_no || '';
      setPersonSelectValue('person-nationality', person.nationality);
      setPersonSelectValue('person-sex', person.sex);
      personDiv.querySelector('.person-dob').value = ensureHtmlDateFormat(person.dob || '');
      personDiv.querySelector('.person-passport-expiry').value = ensureHtmlDateFormat(person.passport_expiry || '');
    });
  }
  
  console.log('Form populated with processed dates and dropdown selections');
}

function fillPersonForm(personIndex) {
  console.log('fillPersonForm called for person index:', personIndex);
  
  const data = collectFormData();
  console.log('Raw collected data:', data);
  
  if (!data.people[personIndex]) {
    alert('Person data not found!');
    return;
  }
  
  if (!validateCommonData(data.commonData)) {
    alert('Please fill in all required common data fields!');
    return;
  }
  
  if (!validatePersonData(data.people[personIndex])) {
    alert('Please fill in all required person data fields!');
    return;
  }
  
  // Debug the dates specifically
  console.log('Person dates before sending:', {
    dob: data.people[personIndex].dob,
    passport_expiry: data.people[personIndex].passport_expiry,
    arrival_date: data.commonData.arrival_date,
    departure_date: data.commonData.departure_date
  });
  
  console.log('Data validation passed, sending to content script...');
  
  // Send message to content script with retry logic
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    console.log('Current tab URL:', currentTab.url);
    
    if (!currentTab.url.includes('imigresen-online.imi.gov.my')) {
      alert('Please navigate to the MDAC registration page first!\n\nClick "Open MDAC Registration Page" button above.');
      return;
    }
    
    console.log('Attempting to connect to content script...');
    
    // Function to try injecting and connecting to content script
    function tryConnectWithRetry(attempts = 0) {
      const maxAttempts = 3;
      
      if (attempts >= maxAttempts) {
        alert('Failed to connect to the page after multiple attempts.\n\nPlease:\n1. Refresh the MDAC page\n2. Reload this extension\n3. Try again');
        return;
      }
      
      // Test if content script is loaded
      chrome.tabs.sendMessage(currentTab.id, {
        action: 'test'
      }, function(testResponse) {
        if (chrome.runtime.lastError) {
          console.error(`Attempt ${attempts + 1}: Content script not loaded:`, chrome.runtime.lastError.message);
          
          // Try to inject the content script manually
          console.log('Attempting to inject content script...');
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content.js']
          }).then(() => {
            console.log('Content script injected, waiting a moment...');
            setTimeout(() => {
              tryConnectWithRetry(attempts + 1);
            }, 1000);
          }).catch((injectError) => {
            console.error('Failed to inject content script:', injectError);
            alert('Failed to load extension on this page.\n\nPlease:\n1. Refresh the MDAC page\n2. Make sure you\'re on a valid MDAC form page\n3. Try again');
          });
          return;
        }
        
        console.log('Content script test response:', testResponse);
        
        // Now send the actual form fill message
        chrome.tabs.sendMessage(currentTab.id, {
          action: 'fillForm',
          data: {
            commonData: data.commonData,
            currentPerson: data.people[personIndex]
          }
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.error('Error sending form fill message:', chrome.runtime.lastError.message);
            alert('Error communicating with page: ' + chrome.runtime.lastError.message);
            return;
          }
          
          console.log('Form fill response:', response);
          
          if (response && response.success) {
            alert(`Form filled successfully for ${data.people[personIndex].name}!`);
          } else {
            alert('Error filling form: ' + (response ? response.message : 'Unknown error'));
          }
        });
      });
    }
    
    // Start the connection attempt
    tryConnectWithRetry();
  });
}

function openMdacPage() {
  chrome.tabs.create({
    url: 'https://imigresen-online.imi.gov.my/mdac/main?registerMain'
  });
}

function validateCommonData(commonData) {
  const required = ['email', 'mobile', 'mobile_dialing_code', 'arrival_date', 'departure_date', 
                   'mode_of_travel', 'last_port_embarkation', 'transport_number', 
                   'accommodation_stay', 'accommodation_address', 'state', 'city', 'postcode'];
  
  const missing = [];
  
  for (const field of required) {
    if (!commonData[field] || commonData[field].trim() === '') {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    console.error('Missing required common data fields:', missing);
    return false;
  }
  
  console.log('✓ Common data validation passed');
  return true;
}

function validatePersonData(person) {
  const required = ['name', 'passport_no', 'nationality', 'sex', 'dob', 'passport_expiry'];
  
  const missing = [];
  
  for (const field of required) {
    if (!person[field] || person[field].trim() === '') {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    console.error('Missing required person data fields:', missing);
    return false;
  }
  
  console.log('✓ Person data validation passed');
  return true;
}

// YAML Import/Export Functions
function exportToYaml() {
  const data = collectFormData();
  
  // Convert to YAML format matching your Python script
  const yamlData = {
    common_data: {
      email: data.commonData.email,
      mobile: data.commonData.mobile, // Keep mobile separate (without country code)
      mobile_dialing_code: data.commonData.mobile_dialing_code, // Keep dialing code separate
      arrival_date: data.commonData.arrival_date,
      departure_date: data.commonData.departure_date,
      mode_of_travel: data.commonData.mode_of_travel,
      last_port_embarkation: data.commonData.last_port_embarkation,
      transport_number: data.commonData.transport_number,
      accommodation_stay: data.commonData.accommodation_stay,
      accommodation_address: data.commonData.accommodation_address,
      accommodation_address2: data.commonData.accommodation_address2,
      postcode: data.commonData.postcode,
      city: data.commonData.city,
      state: data.commonData.state
    },
    people: data.people.map(person => ({
      name: person.name,
      passport_no: person.passport_no,
      nationality: person.nationality,
      sex: person.sex,
      dob: person.dob,
      passport_expiry: person.passport_expiry
    }))
  };
  
  // Convert to YAML string
  const yamlString = convertToYaml(yamlData);
  
  // Download as file
  const blob = new Blob([yamlString], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'people.yaml';
  a.click();
  URL.revokeObjectURL(url);
  
  alert('YAML file exported successfully!');
}

function importFromYaml(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const yamlContent = e.target.result;
      console.log('Raw file content:', yamlContent);
      
      // Try to parse as JSON first (since your file appears to be in JSON format)
      let data;
      try {
        data = JSON.parse(yamlContent);
        console.log('Parsed as JSON:', data);
      } catch (jsonError) {
        console.log('Not JSON, trying YAML parser...');
        data = parseYaml(yamlContent);
        console.log('Parsed as YAML:', data);
      }
      
      // Helper function to convert date format
      function convertDateFormat(dateStr) {
        if (!dateStr) return '';
        
        // If already in YYYY-MM-DD format, return as is
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return dateStr;
        }
        
        // If in DD/MM/YYYY format, convert to YYYY-MM-DD
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/');
          if (parts.length === 3 && parts[0].length <= 2) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
          }
        }
        
        return dateStr;
      }
      
      // Helper function to extract mobile number without country code
      function extractMobileNumber(mobileStr) {
        console.log('extractMobileNumber input:', mobileStr);
        if (!mobileStr) return '';
        
        // If it starts with +, remove the country code
        if (mobileStr.startsWith('+')) {
          // Try common country code patterns first (most are 1-3 digits)
          // Singapore is +65, Malaysia is +60, etc.
          const patterns = [
            /^\+(\d{1,2})(\d{7,})$/,  // 1-2 digit codes with 7+ digit numbers
            /^\+(\d{3})(\d{7,})$/     // 3 digit codes with 7+ digit numbers
          ];
          
          for (const pattern of patterns) {
            const match = mobileStr.match(pattern);
            if (match) {
              const result = match[2]; // The mobile number part
              console.log('extractMobileNumber extracted:', result);
              return result;
            }
          }
        }
        
        console.log('extractMobileNumber returning original:', mobileStr);
        return mobileStr;
      }
      
      // Helper function to extract dialing code from mobile number
      function extractDialingCode(mobileStr) {
        console.log('extractDialingCode input:', mobileStr);
        if (!mobileStr) return '';
        
        // If it starts with +, extract the country code
        if (mobileStr.startsWith('+')) {
          // Try common country code patterns first
          const patterns = [
            /^\+(\d{1,2})(\d{7,})$/,  // 1-2 digit codes with 7+ digit numbers
            /^\+(\d{3})(\d{7,})$/     // 3 digit codes with 7+ digit numbers
          ];
          
          for (const pattern of patterns) {
            const match = mobileStr.match(pattern);
            if (match) {
              const result = match[1]; // The country code part
              console.log('extractDialingCode extracted:', result);
              return result;
            }
          }
        }
        
        console.log('extractDialingCode returning empty string');
        return '';
      }
      
      // Helper function to convert mode of travel
      function convertModeOfTravel(mode) {
        if (!mode) return '';
        
        const modeMap = {
          'Air': 'AIR',
          'Land': 'LAND', 
          'Sea': 'SEA',
          'AIR': 'AIR',
          'LAND': 'LAND',
          'SEA': 'SEA'
        };
        
        return modeMap[mode] || mode.toUpperCase();
      }
      
      // Convert YAML format to extension format
      const extensionData = {
        commonData: {
          email: data.common_data?.email || '',
          mobile: data.common_data?.mobile_dialing_code ? 
                  // If mobile_dialing_code exists, extract mobile number from full mobile
                  extractMobileNumber(data.common_data?.mobile || '') : 
                  // Otherwise use mobile as-is
                  (data.common_data?.mobile || ''),
          mobile_dialing_code: data.common_data?.mobile_dialing_code || 
                              // Fallback: extract from mobile if no separate field
                              extractDialingCode(data.common_data?.mobile || ''),
          arrival_date: convertDateFormat(data.common_data?.arrival_date || ''),
          departure_date: convertDateFormat(data.common_data?.departure_date || ''),
          mode_of_travel: convertModeOfTravel(data.common_data?.mode_of_travel || ''),
          last_port_embarkation: data.common_data?.last_port_embarkation || '',
          transport_number: data.common_data?.transport_number || '',
          accommodation_stay: data.common_data?.accommodation_stay || '',
          accommodation_address: data.common_data?.accommodation_address || '',
          accommodation_address2: data.common_data?.accommodation_address2 || '',
          state: data.common_data?.state || '',
          city: data.common_data?.city || '',
          postcode: data.common_data?.postcode || ''
        },
        people: (data.people || []).map(person => ({
          name: person.name || '',
          passport_no: person.passport_no || '',
          nationality: person.nationality || '',
          sex: person.sex || '',
          dob: convertDateFormat(person.dob || ''),
          passport_expiry: convertDateFormat(person.passport_expiry || '')
        }))
      };
      
      console.log('Imported YAML data (after date conversion):', extensionData);
      
      populateFormData(extensionData);
      
      // Debug: Show what mobile_dialing_code value we're working with
      console.log('Final mobile_dialing_code value:', extensionData.commonData.mobile_dialing_code);
      console.log('Dropdown options available:');
      const dropdown = document.getElementById('mobileDialingCode');
      for (let option of dropdown.options) {
        console.log(`Option value: "${option.value}", text: "${option.text}"`);
      }
      
      const selectedValue = dropdown.value;
      console.log('Current dropdown value after population:', selectedValue);
      
      alert('YAML file imported successfully!');
      
    } catch (error) {
      alert('Error parsing YAML file: ' + error.message);
    }
  };
  reader.readAsText(file);
}

// Simple YAML parser (basic implementation)
function parseYaml(yamlString) {
  const lines = yamlString.split('\n');
  const result = {};
  let currentSection = null;
  let currentObject = result;
  let peopleArray = [];
  let currentPerson = null;
  
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    
    if (line === 'common_data:') {
      currentSection = 'common_data';
      currentObject = result.common_data = {};
    } else if (line === 'people:') {
      currentSection = 'people';
      peopleArray = [];
      result.people = peopleArray;
    } else if (line.startsWith('- ') || line.startsWith('-\t')) {
      // New person in array
      currentPerson = {};
      peopleArray.push(currentPerson);
      currentObject = currentPerson;
      
      // Handle inline format: "- name: John Doe"
      const inlineMatch = line.match(/^-\s*(\w+):\s*(.+)$/);
      if (inlineMatch) {
        currentObject[inlineMatch[1]] = inlineMatch[2].replace(/['"]/g, '');
      }
    } else if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim().replace(/['"]/g, '');
      if (currentObject) {
        currentObject[key.trim()] = value;
      }
    }
  }
  
  return result;
}

// Simple YAML generator
function convertToYaml(obj) {
  let yaml = '';
  
  if (obj.common_data) {
    yaml += 'common_data:\n';
    for (const [key, value] of Object.entries(obj.common_data)) {
      if (value) {
        yaml += `  ${key}: "${value}"\n`;
      }
    }
    yaml += '\n';
  }
  
  if (obj.people && obj.people.length > 0) {
    yaml += 'people:\n';
    for (const person of obj.people) {
      let isFirstProperty = true;
      for (const [key, value] of Object.entries(person)) {
        if (value) {
          if (isFirstProperty) {
            yaml += `  - ${key}: "${value}"\n`;
            isFirstProperty = false;
          } else {
            yaml += `    ${key}: "${value}"\n`;
          }
        }
      }
    }
  }
  
  return yaml;
}
