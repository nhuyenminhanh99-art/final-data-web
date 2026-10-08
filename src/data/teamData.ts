export interface TeamMember {
  id: `member-0${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  number: string;
  name: string;
  fullName: string;
  studentId: string;
  gmail: string;
  role: string;
  shortRole: string;
  responsibility: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  { id: 'member-01', number: '01', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
  { id: 'member-02', number: '02', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
  { id: 'member-03', number: '03', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
  { id: 'member-04', number: '04', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
  { id: 'member-05', number: '05', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
  { id: 'member-06', number: '06', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
  { id: 'member-07', number: '07', name: '', fullName: '', studentId: '', gmail: '', role: '', shortRole: '', responsibility: '', image: '' },
];
