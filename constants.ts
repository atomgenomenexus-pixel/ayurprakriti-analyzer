import { AssessmentModule } from './types';

const NARROW_MED_BROAD = [
  { label: 'Narrow', value: 'narrow', description: '' },
  { label: 'Medium', value: 'medium', description: '' },
  { label: 'Broad', value: 'broad', description: '' }
];

const ANGULA_PRAMANA = [
  { label: 'Broad (> 4 fingers)', value: 'broad', description: 'Forehead height exceeds 4 horizontal finger-widths' },
  { label: 'Medium (4 fingers)', value: 'medium', description: 'Forehead height matches exactly 4 horizontal finger-widths' },
  { label: 'Narrow (≤ 3 fingers)', value: 'narrow', description: 'Forehead height is 3 horizontal finger-widths or less' }
];

const BONY_PROMINENCE = [
  { label: 'Narrow', value: 'narrow', description: 'Wrist easily held; fingers overlap significantly or leave extra space' },
  { label: 'Medium', value: 'medium', description: 'Wrist exactly covered; fingers just touch or meet precisely' },
  { label: 'Wide', value: 'wide', description: 'Difficult to grip; fingers do not meet or cannot fully encircle the wrist' }
];

const SMALL_MED_LARGE = [
  { label: 'Small', value: 'small', description: '' },
  { label: 'Medium', value: 'medium', description: '' },
  { label: 'Large', value: 'large', description: '' }
];

const CLINICAL_COLORS = [
  { label: 'Dark / Blackish', value: 'dark', description: 'Syava / Krsna (Typically Vata)' },
  { label: 'Reddish / Copper', value: 'reddish', description: 'Tamra (Typically Pitta)' },
  { label: 'Pale Yellow / White', value: 'yellowish', description: 'Pandu / Sveta (Typically Kapha)' },
  { label: 'Pinkish / Clear', value: 'pink', description: 'Gaura (High Pitta / Balanced)' }
];

const GRADE_123 = [
  { label: 'Grade 1', value: 'grade1', description: 'Optimal / High' },
  { label: 'Grade 2', value: 'grade2', description: 'Moderate' },
  { label: 'Grade 3', value: 'grade3', description: 'Sub-optimal / Low' }
];

const LOW_MED_HIGH_VAR = [
  { label: 'Low', value: 'low', description: '' },
  { label: 'Medium', value: 'medium', description: '' },
  { label: 'High', value: 'high', description: '' },
  { label: 'Variable', value: 'variable', description: '' }
];

export const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    id: 'prakruti',
    title: 'Prakruti Assessment',
    description: 'Full 36-feature clinical diagnostic using AI-assisted anatomical scanning.',
    icon: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300&h=300',
    questions: [
      /* Automated Features (29 anatomical features) */
      { id: 'p_1_1', category: '1. Body frame Breadth', text: '1.1 Overall Body Frame', options: NARROW_MED_BROAD },
      { id: 'p_1_2', category: '1. Body frame Breadth', text: '1.2 Shoulder Breadth (Bi-acromion)', options: NARROW_MED_BROAD },
      { id: 'p_1_3', category: '1. Body frame Breadth', text: '1.3 Chest Breadth', options: NARROW_MED_BROAD },
      { id: 'p_2_1', category: '2. Body frame Length', text: '2.1 Body Frame Length', options: [{label:'Tall', value:'tall', description:''}, {label:'Medium', value:'medium', description:''}, {label:'Short', value:'short', description:''}] },
      { id: 'p_2_2', category: '2. Body frame Length', text: '2.2 Forehead Length (Angula Pramana)', options: ANGULA_PRAMANA },
      { id: 'p_3_1', category: '3. Body Build', text: '3.1 Body Build', options: [{label:'Weak', value:'weak', description:''}, {label:'Moderate', value:'medium', description:''}, {label:'Well Developed', value:'well', description:''}] },
      { id: 'p_3_2', category: '3. Body Build', text: '3.2 Face Size', options: SMALL_MED_LARGE },
      { id: 'p_3_3', category: '3. Body Build', text: '3.3 Eye Size (Based on Sclera Area)', options: [{ label: 'Large', value: 'large', description: 'Significant white sclera area visible' }, { label: 'Medium', value: 'medium', description: 'Moderate white sclera area' }, { label: 'Small', value: 'small', description: 'Narrow white sclera area' }] },
      { id: 'p_3_4', category: '3. Body Build', text: '3.4 Eyelash Size', options: [{ label: 'Small', value: 'small', description: '' }, { label: 'Medium', value: 'medium', description: '' }, { label: 'Large', value: 'large', description: 'Thick and long lashes' }] },
      { id: 'p_3_5', category: '3. Body Build', text: '3.5 Bony Prominence (Wrist Encirclement)', options: BONY_PROMINENCE },
      { id: 'p_3_6', category: '3. Body Build', text: '3.6 Lip Size', options: [{ label: 'Thin Lips', value: 'thin', description: '' }, { label: 'Medium Lips', value: 'medium', description: '' }, { label: 'Broad/Large Lips', value: 'broad', description: '' }] },
      { id: 'p_3_7', category: '3. Body Build', text: '3.7 Nails Size (L vs B ratio)', options: [{ label: 'Small Nails', value: 'small', description: 'Length shorter than Breadth' }, { label: 'Medium Nails', value: 'medium', description: 'Length equal to Breadth' }, { label: 'Long/Large Nails', value: 'long', description: 'Length more than Breadth' }] },
      { id: 'p_4_1', category: '4. Body Build Musculature', text: '4.1 Upachaya (Musculature)', options: [{ label: 'Thin', value: 'thin', description: 'Lean and slender physique' }, { label: 'Soft and Loosely Knitted', value: 'loose', description: 'Less toned and relaxed structure' }, { label: 'Smooth and Firmly Knitted', value: 'firm', description: 'Well-defined and toned build' }] },
      { id: 'p_5_1', category: '5. Skin Features', text: '5.1 Appearance', type: 'multi-select', options: [{ label: 'Lustrous (Prabha)', value: 'lustrous', description: 'Healthy radiant glow' }, { label: 'Dry Skin (Ruksha)', value: 'dry', description: 'Rough, flaky or ashy' }, { label: 'Clear Skin', value: 'clear', description: 'Minimal blemishes/pores' }, { label: 'Moles (Lanchana)', value: 'moles', description: 'Pigmented spots' }, { label: 'Wrinkles (Vali)', value: 'wrinkled', description: 'Fine lines or loose skin' }, { label: 'Freckles / Pimples', value: 'freckles', description: 'Spots or small eruptions' }] },
      { id: 'p_5_2', category: '5. Skin Features', text: '5.2 Nature', options: [{ label: 'Dry', value: 'dry', description: '' }, { label: 'Oily', value: 'oily', description: '' }, { label: 'Normal', value: 'normal', description: '' }] },
      { id: 'p_5_3', category: '5. Skin Features', text: '5.3 Texture', options: [{ label: 'Rough', value: 'rough', description: '' }, { label: 'Smooth', value: 'smooth', description: '' }, { label: 'Coarse', value: 'coarse', description: '' }] },
      { id: 'p_5_4', category: '5. Skin Features', text: '5.4 Color (Varna)', options: [
        { label: 'Blackish / Dark', value: 'dark', description: 'Krsna/Syava (Vata Dominant)' },
        { label: 'Reddish / Copper', value: 'reddish', description: 'Tamra (Pitta Dominant)' },
        { label: 'Pale / Yellow-White', value: 'yellowish', description: 'Pandu (Kapha Dominant)' },
        { label: 'Pink / Wheatish', value: 'wheatish', description: 'Gaura/Sveta (Balanced)' },
        { label: 'Dusky', value: 'dusky', description: 'Syama' }
      ] },
      
      { id: 'p_7_1', category: '7. Nail features', text: '7.1 Colour', options: CLINICAL_COLORS },
      { id: 'p_7_2', category: '7. Nail features', text: '7.2 Texture', options: [{ label: 'Rough Nails', value: 'rough', description: '' }, { label: 'Smooth Nails', value: 'smooth', description: '' }, { label: 'Brittle/Cracked Nails', value: 'brittle', description: '' }] },
      { id: 'p_7_3', category: '7. Nail features', text: '7.3 Nature', options: [{label:'Firm', value:'firm', description:''}, {label:'Soft', value:'soft', description:''}] },
      { id: 'p_8_1', category: '8. Teeth and Palate', text: '8.1 Teeth Color', options: [{ label: 'White Teeth', value: 'white', description: '' }, { label: 'Yellowish Teeth', value: 'yellowish', description: '' }, { label: 'Dull/Blackish Teeth', value: 'blackish', description: '' }] },
      { id: 'p_8_2', category: '8. Teeth and Palate', text: '8.2 Teeth Shape', options: [{label:'Even Teeth', value:'even', description:''}, {label:'Uneven Teeth', value:'uneven', description:''}] },
      { id: 'p_8_3', category: '8. Teeth and Palate', text: '8.3 Teeth Size', options: [{ label: 'Large', value: 'large', description: '' }, { label: 'Medium', value: 'medium', description: '' }, { label: 'Too Large', value: 'tlarge', description: '' }, { label: 'Too Small', value: 'tsmall', description: '' }] },
      { id: 'p_8_4', category: '8. Teeth and Palate', text: '8.4 Palate Colour', options: [{ label: 'Pale Yellow Palate', value: 'yellowish', description: '' }, { label: 'Reddish Palate', value: 'reddish', description: '' }] },
      { id: 'p_9_1', category: '9. Lips Features', text: '9.1 Colour', options: CLINICAL_COLORS },
      { id: 'p_9_2', category: '9. Lips Features', text: '9.2 Tendency', type: 'multi-select', options: [{ label: 'Cracked Lips', value: 'cracked', description: '' }, { label: 'Wrinkled Lips', value: 'wrinkled', description: '' }, { label: 'Firm/Smooth', value: 'firm', description: '' }] },
      { id: 'p_10_1', category: '10. Palm Features', text: '10.1 Colour', options: CLINICAL_COLORS },
      { id: 'p_10_2', category: '10. Palm Features', text: '10.2 Tendency', type: 'multi-select', options: [{ label: 'Cracked Palms', value: 'cracked', description: '' }, { label: 'Wrinkled Palms', value: 'wrinkled', description: '' }, { label: 'Firm/Smooth', value: 'firm', description: '' }] },
      { id: 'p_11_1', category: '11. Sole Features', text: '11.1 Colour', options: CLINICAL_COLORS },

      /* Manual Sections */
      { id: 'pm_1_4', category: '1. Body frame Breadth', text: '1.4 Forehead Breadth (Mahalalaat)', options: NARROW_MED_BROAD },
      { id: 'pm_11_2', category: '11. Sole Features', text: '11.2 Tendency (Heel)', type: 'multi-select', options: [{ label: 'Cracked Soles', value: 'cracked', description: '' }, { label: 'Wrinkled Soles', value: 'wrinkled', description: '' }, { label: 'Firm/Smooth', value: 'firm', description: '' }] },
      { id: 'pm_18_1', category: '18. Movements at Rest', text: '18.1 Hands Movements', options: [{label:'High', value:'high', description:''}, {label:'Less', value:'less', description:''}, {label:'Moderate', value:'moderate', description:''}] },
      { id: 'pm_18_2', category: '18. Movements at Rest', text: '18.2 Legs Movements', options: [{label:'High', value:'high', description:''}, {label:'Less', value:'less', description:''}, {label:'Moderate', value:'moderate', description:''}] },
      { id: 'pm_18_3', category: '18. Movements at Rest', text: '18.3 Eyebrows Movements', options: [{label:'High', value:'high', description:''}, {label:'Less', value:'less', description:''}, {label:'Moderate', value:'moderate', description:''}] },
      { id: 'pm_18_4', category: '18. Movements at Rest', text: '18.4 Shoulders Movements', options: [{label:'High', value:'high', description:''}, {label:'Less', value:'less', description:''}, {label:'Moderate', value:'moderate', description:''}] },
      
      { id: 'pm_5_5', category: '5. Skin Features', text: '5.5 Type', options: [{label:'Thick', value:'thick', description:''}, {label:'Thin', value:'thin', description:''}] },
      { id: 'pm_6_1', category: '6. Hair Features', text: '6.1 Nature', options: [{label:'Dry', value:'dry', description:''}, {label:'Oily', value:'oily', description:''}, {label:'Normal', value:'normal', description:''}] },
      { id: 'pm_6_2', category: '6. Hair Features', text: '6.2 Color', options: [{ label: 'Black', value: 'black', description: '' }, { label: 'Dusky', value: 'dusky', description: '' }, { label: 'Dark Brown', value: 'brown', description: '' }, { label: 'Light Brown', value: 'lbrown', description: '' }] },
      { id: 'pm_6_3', category: '6. Hair Features', text: '6.3 Type', options: [{label:'Thick', value:'thick', description:''}, {label:'Thin', value:'thin', description:''}] },
      { id: 'pm_6_4', category: '6. Hair Features', text: '6.4 Hair Problems', type: 'multi-select', options: [{ label: 'Graying', value: 'graying', description: '' }, { label: 'Falling', value: 'falling', description: '' }, { label: 'Breaking', value: 'breaking', description: '' }, { label: 'Split Ends', value: 'split', description: '' }, { label: 'None', value: 'none', description: '' }] },
      
      { id: 'pm_12_1', category: '12. Food Behavior & Digestion', text: '12.1 Taste Preference', type: 'multi-select', options: [{label:'Sweet', value:'sweet', description:''}, {label:'Sour', value:'sour', description:''}, {label:'Salty', value:'salty', description:''}, {label:'Bitter', value:'bitter', description:''}, {label:'Pungent', value:'pungent', description:''}, {label:'Astringent', value:'astringent', description:''}] },
      { id: 'pm_12_2', category: '12. Food Behavior & Digestion', text: '12.2 Preferred Food/Beverage', options: [{label:'Cold', value:'cold', description:''}, {label:'Warm', value:'warm', description:''}, {label:'Any', value:'any', description:''}, {label:'None', value:'none', description:''}] },
      { id: 'pm_12_3', category: '12. Food Behavior & Digestion', text: '12.3 Appetite Frequency', options: [{label:'Regular', value:'regular', description:''}, {label:'Irregular', value:'irregular', description:''}] },
      { id: 'pm_12_4', category: '12. Food Behavior & Digestion', text: '12.4 Appetite Amount', options: LOW_MED_HIGH_VAR },
      { id: 'pm_12_5', category: '12. Food Behavior & Digestion', text: '12.5 Digestive Power', options: LOW_MED_HIGH_VAR },
      
      { id: 'pm_13_1', category: '13. Physiological Functions', text: '13.1 Body Temperature', options: LOW_MED_HIGH_VAR },
      { id: 'pm_13_2', category: '13. Physiological Functions', text: '13.2 Perspiration', options: LOW_MED_HIGH_VAR },
      { id: 'pm_13_3', category: '13. Physiological Functions', text: '13.4 Body Odour', options: [{label:'Mild', value:'mild', description:''}, {label:'Strong', value:'strong', description:''}, {label:'Very Less', value:'less', description:''}] },
      { id: 'pm_13_4', category: '13. Physiological Functions', text: '13.4 Sleep Amount', options: LOW_MED_HIGH_VAR },
      { id: 'pm_13_5', category: '13. Physiological Functions', text: '13.4 Sleep Quality', options: [{label:'Deep', value:'deep', description:''}, {label:'Sound', value:'sound', description:''}, {label:'Shallow', value:'shallow', description:''}] },
      { id: 'pm_13_6', category: '13. Physiological Functions', text: '13.6 Weight Change Patterns', options: [{label:'Gain/Lose Easily', value:'easy', description:''}, {label:'Difficulty Gaining', value:'diff_gain', description:''}, {label:'Gain Easily, Lose Hard', value:'easy_gain', description:''}, {label:'Stable', value:'stable', description:''}] },

      { id: 'pm_14_1', category: '14. Bowel Patterns (Koshtha)', text: '14.1 Bowel Frequency', options: [{label:'Regular', value:'regular', description:''}, {label:'Irregular', value:'irregular', description:''}, {label:'Variable', value:'variable', description:''}] },
      { id: 'pm_14_2', category: '14. Bowel Patterns (Koshtha)', text: '14.2 Tendency', options: [{label:'Loose Motion', value:'loose', description:''}, {label:'Constipation', value:'constipation', description:''}, {label:'None', value:'none', description:''}] },
      { id: 'pm_14_3', category: '14. Bowel Patterns (Koshtha)', text: '14.3 Consistency', options: [{label:'Hard', value:'hard', description:''}, {label:'Loose/Semisolid', value:'soft', description:''}, {label:'Formed/Medium', value:'formed', description:''}] },

      { id: 'pm_15_1', category: '15. Strength & Power', text: '15.1 Physical Power', options: GRADE_123 },
      { id: 'pm_15_2', category: '15. Strength & Power', text: '15.2 Mental Power', options: GRADE_123 },
      { id: 'pm_15_3', category: '15. Strength & Power', text: '15.3 Resistance Power', options: GRADE_123 },
      { id: 'pm_15_4', category: '15. Strength & Power', text: '15.4 Healing Power', options: GRADE_123 },

      { id: 'pm_16_1', category: '16. Environmental Response', text: '16.1 Problematic Season', options: [{label:'Summer', value:'summer', description:''}, {label:'Early Winter', value:'ewinter', description:''}, {label:'Late Winter', value:'lwinter', description:''}, {label:'Rainy', value:'rainy', description:''}, {label:'Autumn', value:'autumn', description:''}, {label:'Spring', value:'spring', description:''}, {label:'Transition', value:'transition', description:''}, {label:'None', value:'none', description:''}] },
      { id: 'pm_16_2', category: '16. Environmental Response', text: '16.2 Weather Sensitivity', options: [{label:'Cold', value:'cold', description:''}, {label:'Warm', value:'warm', description:''}, {label:'Both', value:'both', description:''}, {label:'None', value:'none', description:''}, {label:'Stable', value:'stable', description:''}] },

      { id: 'pm_17_1', category: '17. Speech & Voice', text: '17.1 Speaking Speed', options: [{label:'Slow', value:'slow', description:''}, {label:'Quick', value:'quick', description:''}, {label:'Medium', value:'medium', description:''}, {label:'Variable', value:'variable', description:''}] },
      { id: 'pm_17_2', category: '17. Speech & Voice', text: '17.2 Speaking Amount', options: [{label:'High/Excessive', value:'high', description:''}, {label:'Less', value:'less', description:''}, {label:'Moderate', value:'moderate', description:''}] },
      { id: 'pm_17_3', category: '17. Speech & Voice', text: '17.3 Speech Content', type: 'multi-select', options: [{label:'Convincing', value:'convincing', description:''}, {label:'Argumentative', value:'argumentative', description:''}, {label:'Sweet/Pleasing', value:'sweet', description:''}, {label:'Avoids Confrontations', value:'avoidant', description:''}, {label:'Deviated Topic', value:'deviated', description:''}, {label:'Irrelevant', value:'irrelevant', description:''}] },
      { id: 'pm_17_4', category: '17. Speech & Voice', text: '17.4 Voice Clarity', options: [{label:'Clear', value:'clear', description:''}, {label:'Non-clear', value:'unclear', description:''}] },
      { id: 'pm_17_5', category: '17. Speech & Voice', text: '17.5 Voice Quality', type: 'multi-select', options: [{label:'Rough', value:'rough', description:''}, {label:'Deep', value:'deep', description:''}, {label:'Sharp', value:'sharp', description:''}] },

      { id: 'pm_19_1', category: '19. Walking (Gati)', text: '19.1 Amount of Walking', options: [{label:'High/Excessive', value:'high', description:''}, {label:'Less', value:'less', description:''}, {label:'Moderate', value:'moderate', description:''}] },
      { id: 'pm_19_2', category: '19. Walking (Gati)', text: '19.2 Walking Speed', options: [{label:'Quick/Fast', value:'quick', description:''}, {label:'Medium', value:'medium', description:''}, {label:'Slow', value:'slow', description:''}, {label:'Variable', value:'variable', description:''}] },
      { id: 'pm_19_3', category: '19. Walking (Gati)', text: '19.3 Walking Style', options: [{label:'Firm/Steady', value:'steady', description:''}, {label:'Sharp/Accurate', value:'accurate', description:''}, {label:'Wavering/Unsteady', value:'wavering', description:''}] },

      { id: 'pm_20_1', category: '20. Memory (Smriti)', text: '20.1 Memorising Speed', options: [{label:'Quick', value:'quick', description:''}, {label:'Slow', value:'slow', description:''}, {label:'Moderate', value:'moderate', description:''}, {label:'Variable', value:'variable', description:''}] },
      { id: 'pm_20_2', category: '20. Memory (Smriti)', text: '20.2 Forgetfulness Speed', options: [{label:'Quick', value:'quick', description:''}, {label:'Slow', value:'slow', description:''}, {label:'Moderate', value:'moderate', description:''}, {label:'Variable', value:'variable', description:''}] },
      { id: 'pm_20_3', category: '20. Memory (Smriti)', text: '20.3 Retention Power', options: [{label:'Good', value:'good', description:''}, {label:'Medium', value:'medium', description:''}, {label:'Poor', value:'good', description:''}] },
      { id: 'pm_20_4', category: '20. Memory (Smriti)', text: '20.4 Olfactory Memory', options: [{label:'Good', value:'good', description:''}, {label:'Poor', value:'poor', description:''}] },

      { id: 'pm_21_1', category: '21. Work Quality', text: '21.1 Working Quality', options: [{label:'Sharp/Accurate', value:'accurate', description:''}, {label:'Wavering/Deviated', value:'wavering', description:''}, {label:'Well thought of', value:'thoughtful', description:''}] },
      { id: 'pm_21_2', category: '21. Work Quality', text: '21.2 Working Speed', options: [{label:'Quick/Fast', value:'quick', description:''}, {label:'Medium', value:'medium', description:''}, {label:'Slow', value:'slow', description:''}, {label:'Variable', value:'variable', description:''}] },
      { id: 'pm_21_3', category: '21. Work Quality', text: '21.3 Working Style', options: [{label:'Firm/Steady', value:'steady', description:''}, {label:'Sharp/Accurate', value:'accurate', description:''}, {label:'Unsteady', value:'unsteady', description:''}] },
      { id: 'pm_21_4', category: '21. Work Quality', text: '21.4 Planning Quality', options: [{label:'Good', value:'good', description:''}, {label:'Medium', value:'medium', description:''}, {label:'Poor', value:'poor', description:''}] },

      { id: 'pm_22_1', category: '22. Social & Emotional', text: '22.1 Making Friends Speed', options: [{label:'Quickly', value:'quick', description:''}, {label:'Moderately', value:'moderate', description:''}, {label:'Slowly', value:'slow', description:''}, {label:'Variably', value:'variable', description:''}] },
      { id: 'pm_22_2', category: '22. Social & Emotional', text: '22.2 Irritability Frequency', options: [{label:'Quickly', value:'quick', description:''}, {label:'Slowly', value:'slow', description:''}, {label:'Moderately', value:'moderate', description:''}, {label:'Variably', value:'variable', description:''}] },
      { id: 'pm_22_3', category: '22. Social & Emotional', text: '22.3 Anger Frequency', options: [{label:'Quickly', value:'quick', description:''}, {label:'Slowly', value:'slow', description:''}, {label:'Moderately', value:'moderate', description:''}, {label:'Variably', value:'variable', description:''}] }
    ]
  }
];