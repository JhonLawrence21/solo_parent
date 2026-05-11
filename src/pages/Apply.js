import { html } from 'https://esm.sh/preact@10.19.3/html';
import { useState } from 'https://esm.sh/preact@10.19.3/hooks';

const Apply = () => {
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([{ name: '', relation: '', age: '', occupation: '' }]);
  const [formData, setFormData] = useState({
    application_type: 'new', last_name: '', first_name: '', middle_name: '', age: '', sex: '', birthdate: '',
    birth_place: '', address: '', contact_number: '', civil_status: '', number_of_dependents: 0,
    educational_attainment: 'None', purpose_of_application: '', employment_type: 'Unemployed',
    total_monthly_income: 0, type_of_occupancy: 'Own House', classification: '',
    member_4ps: false, member_ip: false, member_philhealth: false, member_sss: false, member_gsis: false,
    member_pagibig: false, comelec_registered: 'No', guardian_name: '', guardian_relation: '',
    guardian_contact: '', zone_leader_name: '', zone_leader_contact: ''
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const addFamilyMember = () => setFamilyMembers(prev => [...prev, { name: '', relation: '', age: '', occupation: '' }]);
  const removeFamilyMember = (i) => setFamilyMembers(prev => prev.filter((_, idx) => idx !== i));
  const updateFamilyMember = (i, field, value) => {
    const updated = [...familyMembers];
    updated[i][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.applicants.create({ ...formData, family_members: familyMembers });
      toast.success('Application submitted successfully!');
      window.location.href = '/track-application';
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const Input = (props) => html`<input class="input-field" ...${props} />`;
  const Select = ({ label, name, options }) => html`
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
      <select class="input-field" onChange="${e => updateField(name, e.target.value)}" required>
        <option value="">Select...</option>
        ${options.map(opt => html`<option value="${opt.value}">${opt.label}</option>`)}
      </select>
    </div>
  `;

  return html`
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Solo Parent Application Form</h1>
        <p class="text-gray-600">Fill out all required information</p>
      </div>
      <form onSubmit="${handleSubmit}" class="space-y-8">
        <div class="card">
          <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Application Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Application Type</label>
              <select class="input-field" onChange="${e => updateField('application_type', e.target.value)}">
                <option value="new">New Application</option>
                <option value="renewal">Renewal</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input class="input-field" onInput="${e => updateField('last_name', e.target.value)} required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input class="input-field" onInput="${e => updateField('first_name', e.target.value)} required />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input class="input-field" onInput="${e => updateField('middle_name', e.target.value)} />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input type="number" class="input-field" onInput="${e => updateField('age', e.target.value)} required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
              <select class="input-field" onChange="${e => updateField('sex', e.target.value)} required>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birthdate *</label>
              <input type="date" class="input-field" onInput="${e => updateField('birthdate', e.target.value)} required />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birth Place *</label>
              <input class="input-field" onInput="${e => updateField('birth_place', e.target.value)} required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input class="input-field" onInput="${e => updateField('contact_number', e.target.value)} required />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea class="input-field" rows="2" onInput="${e => updateField('address', e.target.value)} required></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Civil Status *</label>
              <select class="input-field" onChange="${e => updateField('civil_status', e.target.value)} required>
                <option value="">Select...</option>
                <option value="Widow">Widow</option>
                <option value="Separated">Separated</option>
                <option value="Unwed">Unwed</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Classification *</label>
              <select class="input-field" onChange="${e => updateField('classification', e.target.value)} required>
                <option value="">Select...</option>
                <option value="Unwed">Unwed</option>
                <option value="Widow">Widow</option>
                <option value="Widower">Widower</option>
                <option value="Separated">Separated</option>
                <option value="Annulled">Annulled</option>
                <option value="Foster Parent">Foster Parent</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
              <select class="input-field" onChange="${e => updateField('purpose_of_application', e.target.value)} required>
                <option value="">Select...</option>
                <option value="Educational Assistance">Educational Assistance</option>
                <option value="Livelihood Assistance">Livelihood Assistance</option>
                <option value="Solo Parent Leave">Solo Parent Leave</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Employment Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select class="input-field" onChange="${e => updateField('employment_type', e.target.value)}>
                <option value="Unemployed">Unemployed</option>
                <option value="Private">Private</option>
                <option value="Government">Government</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
              <input type="number" class="input-field" onInput="${e => updateField('total_monthly_income', e.target.value)} />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Occupancy Type</label>
              <select class="input-field" onChange="${e => updateField('type_of_occupancy', e.target.value)}>
                <option value="Own House">Own House</option>
                <option value="Renter">Renter</option>
                <option value="Living with Parents">Living with Parents</option>
                <option value="Living with Relatives">Living with Relatives</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Memberships</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label class="flex items-center gap-2"><input type="checkbox" onChange="${e => updateField('member_4ps', e.target.checked)} /> 4P's</label>
            <label class="flex items-center gap-2"><input type="checkbox" onChange="${e => updateField('member_ip', e.target.checked)} /> IP's</label>
            <label class="flex items-center gap-2"><input type="checkbox" onChange="${e => updateField('member_philhealth', e.target.checked)} /> PhilHealth</label>
            <label class="flex items-center gap-2"><input type="checkbox" onChange="${e => updateField('member_sss', e.target.checked)} /> SSS</label>
            <label class="flex items-center gap-2"><input type="checkbox" onChange="${e => updateField('member_gsis', e.target.checked)} /> GSIS</label>
            <label class="flex items-center gap-2"><input type="checkbox" onChange="${e => updateField('member_pagibig', e.target.checked)} /> PAG-IBIG</label>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">COMELEC Registered</label>
              <select class="input-field" onChange="${e => updateField('comelec_registered', e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Guardian / Contact Person</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Name</label><input class="input-field" onInput="${e => updateField('guardian_name', e.target.value)} /></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Relation</label><input class="input-field" onInput="${e => updateField('guardian_relation', e.target.value)} /></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label><input class="input-field" onInput="${e => updateField('guardian_contact', e.target.value)} /></div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800 border-b pb-2">Family Composition</h2>
            <button type="button" onClick="${addFamilyMember}" class="btn-outline text-sm px-4 py-2">+ Add Member</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr class="text-left">
                  <th class="px-3 py-2">Name</th><th class="px-3 py-2">Relation</th><th class="px-3 py-2">Age</th><th class="px-3 py-2">Occupation</th><th class="w-10"></th>
                </tr>
              </thead>
              <tbody>
                ${familyMembers.map((m, i) => html`
                  <tr class="border-t">
                    <td class="px-3 py-2"><input class="input-field text-sm py-1" value="${m.name}" onInput="${e => updateFamilyMember(i, 'name', e.target.value)} /></td>
                    <td class="px-3 py-2"><input class="input-field text-sm py-1" value="${m.relation}" onInput="${e => updateFamilyMember(i, 'relation', e.target.value)} /></td>
                    <td class="px-3 py-2"><input type="number" class="input-field text-sm py-1 w-20" value="${m.age}" onInput="${e => updateFamilyMember(i, 'age', e.target.value)} /></td>
                    <td class="px-3 py-2"><input class="input-field text-sm py-1" value="${m.occupation}" onInput="${e => updateFamilyMember(i, 'occupation', e.target.value)} /></td>
                    <td class="px-3 py-2">
                      <button type="button" onClick="${() => removeFamilyMember(i)}" class="text-red-500 hover:text-red-700">✕</button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <a href="/" class="btn-outline">Cancel</a>
          <button type="submit" disabled="${loading}" class="btn-primary">
            ${loading ? html`<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>` : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  `;
};

export default Apply;
