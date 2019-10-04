const statuses = {
  checkInfo: 'check-info',
  notAttend: 'Not-attend',
  checkIn: 'Checked-in',
  checkOut: 'Checked-out',
  merchandise: 'merchandise',
};

const times = [
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
];

const hours = [
  '07 AM',
  '08 AM',
  '09 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '01 PM',
  '02 PM',
  '03 PM',
  '04 PM',
  '05 PM',
  '06 PM',
  '07 PM',
  '08 PM',
  '09 PM',
  '10 PM',
  '11 PM',
];

const minutes = ['00', '15', '30', '45'];

const tracks = [
  'All',
  'LCPs',
  'EB',
  'MM',
  'Members',
];

const days = [
  'Thursday',
  'Friday',
  'Saturday',
];

const halls = [
  'Um-Kalthoum',
  'Abo-Kalthoum',
  'Gozhom',
  'Mrathom',
];

const ocRoles = [
  {
    code: 'oc-teamster-de',
    name: 'OC Teamster DE',
  },
  {
    code: 'oc-teamster-se',
    title: 'OC Teamster SE',
  },
  {
    code: 'oc-teamster-catering',
    title: 'OC Teamster Catering',
  },
  {
    code: 'oc-teamster-fundraising',
    title: 'OC Teamster Fundraising',
  },
  {
    code: 'oc-teamster-logistics',
    title: 'OC Teamster DE',
  },
  {
    code: 'oc-teamster-marketing',
    title: 'OC Teamster Marketing',
  },
  {
    code: 'oc-vp-de',
    title: 'OCVP DE',
  },
  {
    code: 'oc-vp-se',
    title: 'OCVP SE',
  },
  {
    code: 'oc-vp-catering',
    title: 'OCVP Catering',
  },
  {
    code: 'oc-vp-fundraising',
    title: 'OCVP Fundraising',
  },
  {
    code: 'oc-vp-logistics',
    title: 'OCVP Logistics',
  },
  {
    code: 'oc-vp-marketing',
    title: 'OCVP Marketing',
  },
  {
    code: 'oc-vp-im',
    title: 'OCVP IM',
  },
  {
    code: 'oc-vp-finance',
    title: 'OCVP Finance',
  },
  {
    code: 'oc-p-all',
    title: 'OCP',
  },
  {
    code: 'oc-coach-none',
    title: 'OC Coach',
  },
  {
    code: 'mc-responsible-none',
    title: 'MC Responsible',
  },
];

const permissions = {
  ADD_MERCHANDISE: 'add_merchandise',
  DELETE_MERCHANDISE: 'deleted_merchandise',
  ADD_SESSION: 'add_session',
  EDIT_SESSION: 'edit_session',
  SCAN_OPERATIONS: 'scan_operations',
}

module.exports = { statuses, times, hours, minutes, halls, tracks, days, permissions, ocRoles };
