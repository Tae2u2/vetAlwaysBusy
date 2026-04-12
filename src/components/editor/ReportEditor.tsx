import React from 'react';
import { ReportData } from '../../types';
import { Field } from './Field';
import { SectionCard } from './SectionCard';

interface Props {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

export const ReportEditor: React.FC<Props> = ({ data, onChange }) => {
  const update = (key: keyof ReportData, value: any) =>
    onChange({ ...data, [key]: value });

  const updatePatient = (key: keyof ReportData['patientInfo'], value: string) =>
    onChange({ ...data, patientInfo: { ...data.patientInfo, [key]: value } });

  return (
    <div className="space-y-4">
      <SectionCard title="환자 정보" badge="Patient Info">
        <div className="grid grid-cols-2 gap-4">
          <Field label="환자명"    value={data.patientInfo.name}             onChange={v => updatePatient('name', v)}             placeholder="코코" />
          <Field label="환자 번호" value={data.patientInfo.patientId}        onChange={v => updatePatient('patientId', v)}        placeholder="573321" />
          <Field label="종"        value={data.patientInfo.species}          onChange={v => updatePatient('species', v)}          placeholder="Canine" />
          <Field label="품종"      value={data.patientInfo.breed}            onChange={v => updatePatient('breed', v)}            placeholder="Cocker Spaniel" />
          <Field label="성별"      value={data.patientInfo.gender}           onChange={v => updatePatient('gender', v)}           placeholder="Female" />
          <Field label="나이"      value={data.patientInfo.age}              onChange={v => updatePatient('age', v)}              placeholder="15 years" />
          <Field label="체중"      value={data.patientInfo.weight}           onChange={v => updatePatient('weight', v)}           placeholder="약 7.5kg" />
          <Field label="수술일자"  value={data.patientInfo.surgeryDate}      onChange={v => updatePatient('surgeryDate', v)}      placeholder="2026년 1월 14일" />
          <Field label="의뢰병원"  value={data.patientInfo.referralHospital} onChange={v => updatePatient('referralHospital', v)} placeholder="온동물병원" />
        </div>
      </SectionCard>

      <SectionCard title="주호소 및 임상 병력">
        <Field label="" value={data.chiefComplaint}     onChange={v => update('chiefComplaint', v)}     multiline placeholder="주호소 및 임상 병력을 입력하세요..." />
      </SectionCard>

      <SectionCard title="혈액 검사 소견" badge="이미지 슬롯 1-2">
        <Field label="" value={data.bloodTests}         onChange={v => update('bloodTests', v)}         multiline placeholder="혈액 검사 결과 요약..." />
      </SectionCard>

      <SectionCard title="VCM 검사 소견" badge="이미지 슬롯 3">
        <Field label="" value={data.vcmFindings}        onChange={v => update('vcmFindings', v)}        multiline placeholder="VCM 검사 결과..." />
      </SectionCard>

      <SectionCard title="DR (X-ray) 소견" badge="이미지 슬롯 4-5">
        <Field label="" value={data.xrayFindings}       onChange={v => update('xrayFindings', v)}       multiline placeholder="방사선 검사 소견..." />
      </SectionCard>

      <SectionCard title="US (초음파) 소견">
        <Field label="" value={data.ultrasoundFindings} onChange={v => update('ultrasoundFindings', v)} multiline placeholder="초음파 검사 소견..." />
      </SectionCard>

      <SectionCard title="CT 소견" badge="이미지 슬롯 6-7">
        <Field label="" value={data.ctFindings}         onChange={v => update('ctFindings', v)}         multiline placeholder="CT 검사 소견..." />
      </SectionCard>

      <SectionCard title="수술 과정" badge="이미지 슬롯 8-10">
        <Field label="" value={data.surgicalProcedure}  onChange={v => update('surgicalProcedure', v)}  multiline placeholder="수술명 및 수술 과정 상세..." />
      </SectionCard>

      <SectionCard title="수술 후 관리 및 계획">
        <Field label="" value={data.postopManagement}   onChange={v => update('postopManagement', v)}   multiline placeholder="수술 후 관리 계획..." />
      </SectionCard>
    </div>
  );
};
