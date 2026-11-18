const specialties = {
  "Cardiovascular / Pulmonary": ["heart", "cardiac", "chest pain", "ecg", "ekg", "coronary", "hypertension", "pulmonary", "lung", "dyspnea", "oxygen"],
  Orthopedic: ["fracture", "bone", "joint", "knee", "hip", "spine", "musculoskeletal", "ligament", "arthritis", "orthopedic"],
  Radiology: ["x-ray", "xray", "mri", "ct scan", "ultrasound", "imaging", "contrast", "radiograph", "findings"],
  Surgery: ["surgery", "surgical", "procedure", "incision", "operative", "anesthesia", "laparoscopic", "resection", "postoperative"],
  Neurology: ["neurological", "brain", "seizure", "migraine", "stroke", "nerve", "headache", "cognitive", "neuropathy"],
  Gastroenterology: ["abdomen", "gastric", "colonoscopy", "liver", "bowel", "gastrointestinal", "nausea", "endoscopy", "pancreas"],
  Urology: ["urinary", "kidney", "renal", "bladder", "prostate", "urology", "urine", "ureter"],
  "Obstetrics / Gynecology": ["pregnancy", "pregnant", "obstetric", "gynecology", "uterus", "ovarian", "delivery", "prenatal"],
  "ENT - Otolaryngology": ["ear", "nose", "throat", "sinus", "tonsil", "hearing", "otolaryngology"],
  Ophthalmology: ["eye", "vision", "retina", "ocular", "cornea", "cataract", "ophthalmology"],
  Dermatology: ["skin", "rash", "dermatology", "lesion", "eczema", "psoriasis", "dermal"]
};
const documentField = document.querySelector('#document');
const count = document.querySelector('#word-count');
const classify = document.querySelector('#classify-button');
const sample = document.querySelector('#sample-button');
function updateCount(){ const words=documentField.value.trim().split(/\s+/).filter(Boolean).length; count.textContent=`${words} word${words===1?'':'s'}`; }
function classifyText(){
  const text=documentField.value.toLowerCase().trim(); if(!text){documentField.focus(); return;}
  const scores=Object.entries(specialties).map(([name,terms])=>({name,score:terms.reduce((total,term)=>total+(text.match(new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'g'))||[]).length,0)})).sort((a,b)=>b.score-a.score);
  const winner=scores[0]; const certainty=winner.score ? Math.min(94, 57+winner.score*7) : 34;
  document.querySelector('#empty-result').classList.add('hidden'); document.querySelector('#prediction').classList.remove('hidden');
  document.querySelector('#specialty').textContent=winner.score ? winner.name : 'General Medicine';
  document.querySelector('#confidence').textContent=`${certainty}% signal`;
  document.querySelector('#meter-fill').style.width=`${certainty}%`;
  document.querySelector('#reason').textContent=winner.score ? `Matched ${winner.score} specialty-specific term${winner.score===1?'':'s'} in the submitted text.` : 'No strong specialty signal found; a general review is recommended.';
  document.querySelector('#alternatives').innerHTML=scores.filter(x=>x.name!==winner.name).slice(0,2).map(x=>`<li>${x.name}</li>`).join('');
}
documentField.addEventListener('input',updateCount); classify.addEventListener('click',classifyText); sample.addEventListener('click',()=>{documentField.value='Patient presents with exertional chest pain and shortness of breath. ECG indicates abnormalities; cardiology follow-up and pulmonary evaluation are recommended.';updateCount();classifyText();});
