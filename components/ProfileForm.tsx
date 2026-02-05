import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { AyurAvatar } from './Layout';

interface Props {
  onSubmit: (profile: UserProfile) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const ProfileForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    place: '',
    occupation: ''
  });
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge : 0);
    }
  }, [formData.dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dob && formData.sex && formData.place && formData.occupation) {
      onSubmit({
        ...formData,
        age: age || 0
      });
    }
  };

  const isFormValid = formData.name && formData.dob && formData.sex && formData.place && formData.occupation;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-24 h-24 rounded-full bg-emerald-950 flex items-center justify-center border-4 border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.2)] mx-auto mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-400/5 group-hover:bg-amber-400/10 transition-all"></div>
          <AyurAvatar className="w-16 h-16 relative z-10 text-amber-400" />
        </div>
        <h2 className="text-4xl font-cinzel font-black text-amber-400 mb-3 tracking-widest uppercase leading-tight">Patient Profile</h2>
        <p className="text-emerald-400/60 font-black uppercase tracking-[0.3em] text-[10px]">Initialize Clinical Data Stream</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-emerald-950/40 p-10 rounded-[3rem] border border-emerald-800/50 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">Full Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Vishnu Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-white placeholder-emerald-700 focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">Phone (Optional)</label>
            <input
              type="tel"
              placeholder="+91 00000 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-white placeholder-emerald-700 focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">Sex *</label>
            <select
              required
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
              className="w-full bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Date of Birth *</label>
              {age !== null && (
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Calculated Age: {age}</span>
              )}
            </div>
            <input
              required
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">State of Residence *</label>
            <select
              required
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              className="w-full bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium appearance-none"
            >
              <option value="" disabled>Select State</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state} className="bg-emerald-950 text-white">{state}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">Occupation *</label>
            <input
              required
              type="text"
              placeholder="e.g. Software Engineer"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full bg-emerald-900/50 border border-emerald-800 rounded-2xl px-6 py-4 text-white placeholder-emerald-700 focus:outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-6 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-[0.98] uppercase tracking-[0.2em] relative overflow-hidden group ${
              isFormValid 
              ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300' 
              : 'bg-emerald-900/50 text-emerald-800 cursor-not-allowed grayscale'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Proceed to Assessment
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
          <p className="text-center text-[10px] text-emerald-700 mt-6 uppercase tracking-widest font-black">* Mandatory for Clinical Accuracy</p>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;