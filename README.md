# MDAC Form Filler Chrome Extension

A Chrome extension that automates form filling for the Malaysian Department of Immigration's MDAC (Malaysia Digital Arrival Card) registration system. This extension streamlines the process of filling out arrival forms for multiple travelers by importing data from YAML files and automatically populating the web form.

## Features

- 🚀 **Automated Form Filling**: Automatically fills MDAC registration forms with pre-saved data
- 📋 **Multi-Person Support**: Manage and fill forms for multiple travelers
- 📁 **YAML Import/Export**: Import traveler data from YAML files and export current form data
- 🌍 **Comprehensive Country Support**: Supports all 250+ nationalities and 90+ international dialing codes available in the MDAC system
- 📅 **Smart Date Handling**: Automatically converts between different date formats (DD/MM/YYYY ↔ YYYY-MM-DD)
- 🔄 **Data Validation**: Validates required fields before form submission
- 💾 **Local Storage**: Automatically saves form data locally in the browser

## Installation

### From Source (Developer Mode)

1. **Download the extension files**:
   - Clone this repository or download the ZIP file
   - Extract to a folder on your computer

2. **Enable Developer Mode in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the extension**:
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should appear in your extensions list

4. **Pin the extension** (optional):
   - Click the extensions icon (puzzle piece) in Chrome toolbar
   - Pin the MDAC Form Filler for easy access

## Usage

### Basic Workflow

1. **Import your data** (optional):
   - Click "Import YAML File" to load pre-saved traveler information
   - Or manually enter data in the extension popup

2. **Navigate to MDAC**:
   - Click "Open MDAC Registration Page" to go to the official site
   - Or manually navigate to the MDAC registration form

3. **Fill the form**:
   - Use the "Fill Form for This Person" button for each traveler
   - The extension will automatically populate all form fields

4. **Export data** (optional):
   - Click "Export to YAML" to save current data for future use

### YAML File Format

The extension supports YAML files with the following structure:

```yaml
common_data:
  email: "traveler@example.com"
  mobile: "81234567"
  mobile_dialing_code: "65"
  arrival_date: "2024-12-25"
  departure_date: "2024-12-30"
  mode_of_travel: "AIR"
  last_port_embarkation: "Singapore"
  transport_number: "SQ123"
  accommodation_stay: "HOTEL/MOTEL/REST HOUSE"
  accommodation_address: "123 Hotel Street"
  accommodation_address2: "Room 456"
  state: "KUALA LUMPUR"
  city: "Kuala Lumpur"
  postcode: "50000"

people:
  - name: "John Doe"
    passport_no: "A12345678"
    nationality: "USA"
    sex: "MALE"
    dob: "1990-01-15"
    passport_expiry: "2030-01-15"
  - name: "Jane Doe"
    passport_no: "B87654321"
    nationality: "USA"
    sex: "FEMALE"
    dob: "1992-05-20"
    passport_expiry: "2030-05-20"
```

### Supported Fields

#### Common Data (shared by all travelers)
- Email address
- Mobile number with international dialing code
- Arrival and departure dates
- Mode of travel (Air/Land/Sea)
- Last port of embarkation
- Flight/transport number
- Accommodation details (type, address, state, city, postcode)

#### Individual Traveler Data
- Full name
- Passport number
- Nationality (250+ countries supported)
- Gender
- Date of birth
- Passport expiry date

## File Structure

```
mdac-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Main extension logic
├── content.js             # Content script for form manipulation
├── background.js          # Service worker (if needed)
└── README.md              # This file
```

## Technical Details

### Permissions

The extension requires the following permissions:
- `activeTab`: To interact with the current MDAC page
- `storage`: To save form data locally
- `tabs`: To open new MDAC registration pages
- `scripting`: To inject content scripts for form filling

### Compatibility

- **Browser**: Chrome (Manifest V3)
- **Website**: Malaysian Immigration MDAC system (`imigresen-online.imi.gov.my`)
- **Data Formats**: YAML and JSON import/export

### Features in Detail

#### Smart Date Conversion
- Automatically converts DD/MM/YYYY format to YYYY-MM-DD for HTML date inputs
- Handles various date formats in imported files

#### Comprehensive Country Support
- Supports all 250+ nationalities from the official MDAC system
- Includes special territories, refugee status, and stateless options
- 90+ international dialing codes covering all major countries

#### Robust Form Filling
- Handles dropdown selections with fallback methods
- Validates data before attempting to fill forms
- Provides detailed error messages for troubleshooting

## Development

### Making Changes

1. Edit the source files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the MDAC Form Filler extension
4. Test your changes

### Common Development Tasks

- **Adding new form fields**: Update both `popup.html` and the content script
- **Modifying YAML format**: Update the import/export functions in `popup.js`
- **Updating country lists**: Modify the nationality dropdown in `popup.js`

## Troubleshooting

### Common Issues

1. **Extension not working on MDAC page**:
   - Ensure you're on the correct MDAC registration page
   - Try refreshing both the page and reloading the extension

2. **Form not filling correctly**:
   - Check that all required fields are filled in the extension
   - Verify the page has fully loaded before attempting to fill

3. **YAML import errors**:
   - Ensure your YAML file follows the correct format
   - Check for proper indentation and quotes around values

4. **Dropdown selections not working**:
   - Verify that the values in your YAML match the expected format
   - Check the browser console for detailed error messages

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your YAML file format matches the example
3. Ensure you're using the latest version of the extension

## License

This project is open source. Please check the license file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Disclaimer

This extension is an unofficial tool designed to assist with MDAC form filling. Users are responsible for ensuring the accuracy of their submitted information. Always verify that all details are correct before submitting official immigration forms.

## Changelog

### Version 1.0.0
- Initial release
- Basic form filling functionality
- YAML import/export support
- Multi-person management
- Comprehensive nationality and dialing code support

---

**Note**: This extension is not affiliated with the Malaysian Department of Immigration. It is a community-developed tool to improve user experience with the MDAC system.
- **Error handling**: Provides feedback on form filling success/failure

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `mdac-extension` folder
4. The extension will appear in your Chrome toolbar

## Usage

1. **Navigate to the MDAC form**: Go to https://imigresen-online.imi.gov.my/mdac/main?registerMain
2. **Open the extension**: Click the MDAC Form Filler icon in your Chrome toolbar
3. **Fill in the data**:
   - Complete the "Common Data" section with travel and accommodation details
   - Add people using the "Add Person" button
   - Fill in each person's details (name, passport, nationality, etc.)
4. **Save your data**: Click "Save Data" to store the information for future use
5. **Fill the form**: Click "Fill Form for This Person" for the person you want to submit

## Data Fields

### Common Data
- Email address
- Mobile number and country code
- Arrival and departure dates
- Mode of travel (Air/Land/Sea)
- Last port of embarkation
- Transport number (flight number, etc.)
- Accommodation details (type, address, state, city, postcode)

### Person Data
- Full name
- Passport number
- Nationality
- Gender
- Date of birth
- Passport expiry date

## Tips

- **Save your data**: Use the "Save Data" function to avoid re-entering information
- **Check the form**: After filling, review the form before submitting
- **One person at a time**: Fill and submit one person's form before moving to the next
- **Address formatting**: Addresses are automatically formatted with proper capitalization

## Troubleshooting

- **"Please navigate to the MDAC registration page first!"**: Make sure you're on the correct MDAC form page
- **Form not filling**: Check that all required fields are filled in the extension popup
- **Data not saving**: Ensure you have sufficient Chrome storage permissions

## Technical Notes

- Uses Chrome Extension Manifest V3
- Requires permissions for the MDAC website and local storage
- Content script automatically detects MDAC form fields
- Compatible with Chrome's latest security policies

## Support

If you encounter issues:
1. Check that you're on the correct MDAC website
2. Verify all required fields are filled
3. Try refreshing the page and reopening the extension
4. Check the Chrome console for error messages

---

**Note**: This extension is for legitimate use in filling out Malaysian immigration forms. Ensure all information entered is accurate and truthful.
