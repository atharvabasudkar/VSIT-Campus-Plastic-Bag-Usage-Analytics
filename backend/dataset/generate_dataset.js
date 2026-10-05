const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const NUM_RECORDS = 1050;

const userCategories = ['Students', 'Teaching Staff', 'Non-Teaching Staff', 'Vendors', 'Visitors'];
const departments = ['BSc IT', 'BSc CS', 'BCA', 'MSc IT', 'Teaching Staff', 'Administrative Staff', 'Other'];
const locations = [
  'Canteen',
  'Cafeteria',
  'Stationery Area',
  'Library Area',
  'Administrative Area',
  'Campus Events',
  'Student Activity Area',
  'Entrance / Exit',
  'Nearby Vendor Interaction',
  'Other'
];
const bagTypes = [
  'Thin Carry Bag',
  'Medium Carry Bag',
  'Large Carry Bag',
  'Food Packaging Bag',
  'Shopping Bag',
  'Other'
];

const bagWeights = {
  'Thin Carry Bag': 4.5,
  'Medium Carry Bag': 8.0,
  'Large Carry Bag': 14.5,
  'Food Packaging Bag': 5.5,
  'Shopping Bag': 12.0,
  'Other': 7.0
};

const purposes = [
  'Food takeaway',
  'Snack packaging',
  'Stationery purchase',
  'Document / book carrying',
  'Event material transport',
  'Personal item storage',
  'Vendor supply delivery',
  'Beverage container'
];

const reductionActions = [
  'Carried cloth bag',
  'Refused plastic bag',
  'Reused old plastic bag',
  'Used paper container',
  'None'
];

const disposalMethods = ['Dustbin', 'Recycling Bin', 'Reused', 'Littered'];

const notesTemplates = [
  'Observed during peak lunch rush hour.',
  'Single snack item packed in thin polythene.',
  'Student refused extra plastic bag and used backpack.',
  'Vendor supplied food in double plastic bag.',
  'Stationery purchase wrapped in plastic carry bag.',
  'Event setup generated bulk plastic packaging waste.',
  'Staff member carried reusable canvas tote bag.',
  'Plastic bag discarded in general waste bin.',
  'Reused plastic bag brought from home.',
  'Awareness poster displayed nearby; student opted out of plastic.'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRecords() {
  const records = [];
  const startDate = new Date('2024-10-01');
  const endDate = new Date('2025-09-30');
  const timeSpan = endDate.getTime() - startDate.getTime();

  for (let i = 1; i <= NUM_RECORDS; i++) {
    const record_id = `REC-VSIT-${String(i).padStart(4, '0')}`;
    
    // Random date within span
    const randomTime = startDate.getTime() + Math.random() * timeSpan;
    const recDate = new Date(randomTime);
    const dateStr = recDate.toISOString().split('T')[0];
    const monthStr = dateStr.substring(0, 7);

    // Correlated sampling
    const location = getRandomItem(locations);
    const userCategory = getRandomItem(userCategories);
    const department = userCategory === 'Teaching Staff' ? 'Teaching Staff' 
                     : userCategory === 'Non-Teaching Staff' ? 'Administrative Staff' 
                     : userCategory === 'Vendors' || userCategory === 'Visitors' ? 'Other'
                     : getRandomItem(['BSc IT', 'BSc CS', 'BCA', 'MSc IT']);

    const campaignExposure = Math.random() > 0.4 ? 'Yes' : 'No';
    const awarenessLevel = campaignExposure === 'Yes' 
      ? (Math.random() > 0.3 ? 'High' : 'Medium') 
      : (Math.random() > 0.5 ? 'Medium' : 'Low');

    const reusableBagUsed = (awarenessLevel === 'High' && Math.random() > 0.3) || (awarenessLevel === 'Medium' && Math.random() > 0.6) ? 'Yes' : 'No';

    // Bag counts base on location & reusable status
    let baseBags = 1;
    if (location === 'Canteen' || location === 'Cafeteria' || location === 'Nearby Vendor Interaction') {
      baseBags = getRandomInt(1, 4);
    } else if (location === 'Campus Events') {
      baseBags = Math.random() > 0.85 ? getRandomInt(10, 25) : getRandomInt(2, 6); // occasional bulk event outliers
    } else if (location === 'Stationery Area' || location === 'Student Activity Area') {
      baseBags = getRandomInt(1, 3);
    } else {
      baseBags = getRandomInt(1, 2);
    }

    if (reusableBagUsed === 'Yes') {
      baseBags = Math.max(0, baseBags - getRandomInt(1, 2));
    }

    const bagType = location === 'Canteen' || location === 'Cafeteria' ? getRandomItem(['Food Packaging Bag', 'Thin Carry Bag', 'Medium Carry Bag'])
                  : location === 'Stationery Area' ? getRandomItem(['Thin Carry Bag', 'Medium Carry Bag', 'Shopping Bag'])
                  : location === 'Campus Events' ? getRandomItem(['Large Carry Bag', 'Medium Carry Bag', 'Food Packaging Bag'])
                  : getRandomItem(bagTypes);

    const weightPerBag = bagWeights[bagType] || 7.0;
    const estimatedWeightGrams = Math.round(baseBags * weightPerBag * (0.9 + Math.random() * 0.2) * 10) / 10;

    const plasticAvoidable = reusableBagUsed === 'Yes' ? 'No' : (Math.random() > 0.25 ? 'Yes' : 'No');
    
    let reductionAction = 'None';
    if (reusableBagUsed === 'Yes') {
      reductionAction = getRandomItem(['Carried cloth bag', 'Reused old plastic bag']);
    } else if (plasticAvoidable === 'Yes' && campaignExposure === 'Yes') {
      reductionAction = getRandomItem(['Refused plastic bag', 'Used paper container']);
    }

    const disposal = reusableBagUsed === 'Yes' ? 'Reused' 
                   : (location === 'Canteen' || location === 'Administrative Area') ? getRandomItem(['Dustbin', 'Recycling Bin', 'Dustbin']) 
                   : getRandomItem(disposalMethods);

    const rating = awarenessLevel === 'High' ? getRandomInt(4, 5) : awarenessLevel === 'Medium' ? getRandomInt(3, 4) : getRandomInt(1, 3);
    const purpose = getRandomItem(purposes);
    const notes = getRandomItem(notesTemplates);

    records.push({
      record_id,
      date: dateStr,
      month: monthStr,
      user_category: userCategory,
      department,
      campus_location: location,
      bag_type: bagType,
      bags_used: baseBags,
      estimated_weight_grams: estimatedWeightGrams,
      purpose,
      reusable_bag_used: reusableBagUsed,
      plastic_avoidable: plasticAvoidable,
      awareness_level: awarenessLevel,
      campaign_exposure: campaignExposure,
      reduction_action: reductionAction,
      disposal_method: disposal,
      survey_rating: rating,
      notes
    });
  }

  // Sort by date ascending
  records.sort((a, b) => a.date.localeCompare(b.date));
  return records;
}

async function exportCsv() {
  const datasetDir = path.join(__dirname, '..', '..', 'dataset');
  const backendDatasetDir = __dirname;
  
  if (!fs.existsSync(datasetDir)) {
    fs.mkdirSync(datasetDir, { recursive: true });
  }

  const csvHeader = [
    { id: 'record_id', title: 'record_id' },
    { id: 'date', title: 'date' },
    { id: 'month', title: 'month' },
    { id: 'user_category', title: 'user_category' },
    { id: 'department', title: 'department' },
    { id: 'campus_location', title: 'campus_location' },
    { id: 'bag_type', title: 'bag_type' },
    { id: 'bags_used', title: 'bags_used' },
    { id: 'estimated_weight_grams', title: 'estimated_weight_grams' },
    { id: 'purpose', title: 'purpose' },
    { id: 'reusable_bag_used', title: 'reusable_bag_used' },
    { id: 'plastic_avoidable', title: 'plastic_avoidable' },
    { id: 'awareness_level', title: 'awareness_level' },
    { id: 'campaign_exposure', title: 'campaign_exposure' },
    { id: 'reduction_action', title: 'reduction_action' },
    { id: 'disposal_method', title: 'disposal_method' },
    { id: 'survey_rating', title: 'survey_rating' },
    { id: 'notes', title: 'notes' }
  ];

  const records = generateRecords();

  const filePaths = [
    path.join(datasetDir, 'VSIT_Campus_Plastic_Bag_Usage_Dataset.csv'),
    path.join(backendDatasetDir, 'VSIT_Campus_Plastic_Bag_Usage_Dataset.csv')
  ];

  for (const filePath of filePaths) {
    const csvWriter = createCsvWriter({
      path: filePath,
      header: csvHeader
    });
    await csvWriter.writeRecords(records);
    console.log(`Successfully generated ${records.length} records in ${filePath}`);
  }
}

if (require.main === module) {
  exportCsv().catch(err => console.error(err));
}

module.exports = { generateRecords, exportCsv };
