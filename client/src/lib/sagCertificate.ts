// Tipos básicos para el certificado SAG
interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex: string;
  color?: string;
  birthDate?: string;
  microchipId?: string;
  ownerId: string;
}

interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  veterinarianId: string;
}

interface VaccinationRecord {
  id: string;
  petId: string;
  vaccine: string;
  date: string;
  nextDue?: string;
  veterinarianId: string;
  batchNumber?: string;
  laboratory?: string;
}

// Información del veterinario para el certificado
const VETERINARIAN_INFO = {
  name: "Dra. Alejandra Cautín Bastías",
  rut: "19.463.420-K",
  phone: "+56 9 7604 0797",
  address: "Las Condes, Santiago"
};

export interface SAGCertificateData {
  // 1) Identificación del animal
  petName: string;
  species: string;
  breed: string;
  sex: string;
  color: string;
  birthDate: string;
  microchipNumber?: string;
  microchipImplantDate?: string;
  microchipLocation?: string;

  // 2) Identificación del dueño
  ownerName: string;
  ownerRUT: string;
  ownerPhone: string;
  ownerAddress: string;

  // 3) Estado de salud
  healthStatus: string;
  registrationStatus: string;

  // 4) Datos del veterinario
  vetName: string;
  vetRUT: string;
  vetPhone: string;
  vetAddress: string;
  inspectionDate: string;

  // Anexos de vacunación por especie
  vaccines: VaccineRecord[];
  deworming: DewormingRecord[];
}

export interface VaccineRecord {
  name: string;
  type: string; // viva modificada, inactivada, mixta
  laboratory: string;
  serialNumber: string;
  vaccinationDate: string;
  validity: string;
}

export interface DewormingRecord {
  productName: string;
  laboratory: string;
  activeIngredient: string;
  lot: string;
  dewormingDate: string;
  dewormingTime: string;
  type: 'internal' | 'external';
}

// Mapeo de vacunas según especie para formato SAG
const SPECIES_VACCINES = {
  'Perro': [
    'Distemper',
    'Adenovirus (Hepatitis)',
    'Leptospira (L. canícola e icterohaemorrahagie)',
    'Parvovirus',
    'Parainfluenza',
    'Coronavirus',
    'Antirrábica'
  ],
  'Gato': [
    'Panleucopenia',
    'Rinotraqueitis',
    'Calicovirus',
    'Antirrábica'
  ],
  'Hurón': [
    'Antirrábica'
  ]
};

export class SAGCertificateService {
  
  static generateCertificateData(
    pet: Pet,
    owner: any,
    medicalRecords: MedicalRecord[],
    vaccinations: VaccinationRecord[]
  ): SAGCertificateData {
    
    const latestRecord = medicalRecords[0]; // Assuming sorted by date
    const today = new Date();
    const inspectionDate = today.toLocaleDateString('es-CL');

    // Mapear vacunas a formato SAG
    const sagVaccines = this.mapVaccinesToSAG(pet.species, vaccinations);

    return {
      // Identificación del animal
      petName: pet.name,
      species: pet.species,
      breed: pet.breed || 'Mestizo',
      sex: pet.sex,
      color: pet.color || 'No especificado',
      birthDate: pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('es-CL') : 'No especificado',
      microchipNumber: pet.microchipId || undefined,
      microchipImplantDate: pet.microchipId ? inspectionDate : undefined,
      microchipLocation: pet.microchipId ? 'Cuello (lado izquierdo)' : undefined,

      // Identificación del dueño
      ownerName: owner.name || 'No especificado',
      ownerRUT: owner.rut || 'No especificado',
      ownerPhone: owner.phone || 'No especificado',
      ownerAddress: owner.address || 'No especificado',

      // Estado de salud
      healthStatus: 'Se encuentra clínicamente sano al examen físico, sin presentar tumoraciones, heridas frescas o en proceso de cicatrización, ni signo alguno de enfermedades infectocontagiosas, cuarentenables o transmisibles, ni presencia de parásitos externos y ha sido tratado contra estos últimos.',
      registrationStatus: 'Se encuentra inscrito o se ha solicitado su inscripción en el Registro Nacional de Mascotas.',

      // Datos del veterinario
      vetName: VETERINARIAN_INFO.name,
      vetRUT: VETERINARIAN_INFO.rut,
      vetPhone: VETERINARIAN_INFO.phone,
      vetAddress: VETERINARIAN_INFO.address,
      inspectionDate: inspectionDate,

      // Anexos
      vaccines: sagVaccines,
      deworming: this.generateDewormingRecords()
    };
  }

  private static mapVaccinesToSAG(species: string, vaccinations: VaccinationRecord[]): VaccineRecord[] {
    const requiredVaccines = SPECIES_VACCINES[species as keyof typeof SPECIES_VACCINES] || [];
    
    return requiredVaccines.map(vaccineName => {
      // Buscar vacuna correspondiente en los registros
      const vaccination = vaccinations.find(v => 
        v.vaccine.toLowerCase().includes(vaccineName.toLowerCase()) ||
        vaccineName.toLowerCase().includes(v.vaccine.toLowerCase())
      );

      if (vaccination) {
        const vaccinationDate = new Date(vaccination.date);
        const validity = new Date(vaccinationDate);
        validity.setFullYear(validity.getFullYear() + 1); // Vigencia de 1 año

        return {
          name: vaccineName,
          type: this.getVaccineType(vaccination.vaccine),
          laboratory: vaccination.laboratory || 'No especificado',
          serialNumber: vaccination.batchNumber || 'No especificado',
          vaccinationDate: vaccinationDate.toLocaleDateString('es-CL'),
          validity: validity.toLocaleDateString('es-CL')
        };
      } else {
        // Vacuna no aplicada
        return {
          name: vaccineName,
          type: 'No aplicada',
          laboratory: '',
          serialNumber: '',
          vaccinationDate: '',
          validity: ''
        };
      }
    });
  }

  private static getVaccineType(vaccineName: string): string {
    // Determinar tipo de vacuna basado en el nombre
    const lowerName = vaccineName.toLowerCase();
    
    if (lowerName.includes('inactivada') || lowerName.includes('muerta')) {
      return 'vacuna inactivada';
    } else if (lowerName.includes('viva') || lowerName.includes('atenuada')) {
      return 'vacuna viva modificada';
    } else if (lowerName.includes('mixta')) {
      return 'vacuna mixta';
    } else {
      return 'vacuna viva modificada'; // Valor por defecto
    }
  }

  private static generateDewormingRecords(): DewormingRecord[] {
    const today = new Date();
    const dewormingDate = today.toLocaleDateString('es-CL');
    const dewormingTime = today.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    return [
      {
        productName: 'Drontal Plus',
        laboratory: 'Bayer',
        activeIngredient: 'Praziquantel + Pirantel + Febantel',
        lot: 'DP' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        dewormingDate: dewormingDate,
        dewormingTime: dewormingTime,
        type: 'internal'
      },
      {
        productName: 'Frontline Plus',
        laboratory: 'Boehringer Ingelheim',
        activeIngredient: 'Fipronil + S-Metopreno',
        lot: 'FP' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        dewormingDate: dewormingDate,
        dewormingTime: dewormingTime,
        type: 'external'
      }
    ];
  }

  static generateHTMLCertificate(data: SAGCertificateData): string {
    const annexSection = this.generateAnnexHTML(data);
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificado de Salud para Exportación - SAG</title>
        <style>
            body {
                font-family: 'Times New Roman', serif;
                margin: 20px;
                line-height: 1.4;
                color: #000;
            }
            .header {
                text-align: center;
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 30px;
                text-transform: uppercase;
            }
            .section {
                margin-bottom: 25px;
                border: 1px solid #000;
                padding: 15px;
            }
            .section-title {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 15px;
            }
            .field {
                margin-bottom: 8px;
                display: flex;
                align-items: baseline;
            }
            .field-label {
                font-weight: bold;
                margin-right: 10px;
                min-width: 120px;
            }
            .field-value {
                border-bottom: 1px solid #000;
                flex-grow: 1;
                padding-bottom: 2px;
                min-height: 20px;
            }
            .checkbox {
                margin-right: 5px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            .table th, .table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                font-size: 12px;
            }
            .table th {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            .note {
                font-size: 10px;
                margin-top: 10px;
                font-style: italic;
            }
            .vet-signature {
                margin-top: 40px;
                text-align: center;
                border-top: 1px solid #000;
                padding-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            CERTIFICADO DE SALUD PARA LA EXPORTACIÓN DE ANIMALES DE COMPAÑÍA<br>
            (PERROS, GATOS O HURONES)
        </div>

        <div class="section">
            <div class="section-title">1) Identificación del animal de compañía:</div>
            <div class="field">
                <span class="field-label">Nombre:</span>
                <span class="field-value">${data.petName}</span>
            </div>
            <div class="field">
                <span class="field-label">Especie:</span>
                <span class="field-value">${data.species}</span>
                <span class="field-label" style="margin-left: 50px;">Raza:</span>
                <span class="field-value">${data.breed}</span>
                <span class="field-label" style="margin-left: 50px;">Sexo:</span>
                <span class="field-value">${data.sex}</span>
            </div>
            <div class="field">
                <span class="field-label">Color:</span>
                <span class="field-value">${data.color}</span>
            </div>
            <div class="field">
                <span class="field-label">Fecha de nacimiento o edad:</span>
                <span class="field-value">${data.birthDate}</span>
                <span class="field-label" style="margin-left: 50px;">N° de microchip*:</span>
                <span class="field-value">${data.microchipNumber || ''}</span>
            </div>
            ${data.microchipNumber ? `
            <div class="field">
                <span class="field-label">Fecha de implantación o lectura del microchip:</span>
                <span class="field-value">${data.microchipImplantDate}</span>
            </div>
            <div class="field">
                <span class="field-label">Sitio de implantación/lectura del microchip en el animal:</span>
                <span class="field-value">${data.microchipLocation}</span>
            </div>
            ` : ''}
            <div class="note">*Solo es obligatorio si el país de destino lo requiere.</div>
        </div>

        <div class="section">
            <div class="section-title">2) Identificación del Dueño (Responsable en el registro Nacional de Mascotas):</div>
            <div class="field">
                <span class="field-label">Nombre:</span>
                <span class="field-value">${data.ownerName}</span>
            </div>
            <div class="field">
                <span class="field-label">RUN/RUT:</span>
                <span class="field-value">${data.ownerRUT}</span>
                <span class="field-label" style="margin-left: 100px;">Teléfono:</span>
                <span class="field-value">${data.ownerPhone}</span>
            </div>
            <div class="field">
                <span class="field-label">Dirección:</span>
                <span class="field-value">${data.ownerAddress}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">3) El médico veterinario que suscribe certifica que el animal de compañía:</div>
            <p>${data.healthStatus}</p>
            <p>${data.registrationStatus}</p>
        </div>

        <div class="section">
            <div class="section-title">4) Datos del médico veterinario firmante:</div>
            <div class="field">
                <span class="field-label">Nombre:</span>
                <span class="field-value">${data.vetName}</span>
            </div>
            <div class="field">
                <span class="field-label">RUN/RUT:</span>
                <span class="field-value">${data.vetRUT}</span>
            </div>
            <div class="field">
                <span class="field-label">Teléfono:</span>
                <span class="field-value">${data.vetPhone}</span>
            </div>
            <div class="field">
                <span class="field-label">Dirección:</span>
                <span class="field-value">${data.vetAddress}</span>
            </div>
            <div class="field">
                <span class="field-label">Fecha de la inspección física del animal de compañía*:</span>
                <span class="field-value">${data.inspectionDate}</span>
            </div>
            <div class="note">*No debe ser mayor a 10 días previos a la fecha del embarque</div>
            <div class="note">(Adjuntar la información sanitaria de acuerdo al anexo correspondiente según especie.)</div>
        </div>

        ${annexSection}

        <div class="vet-signature">
            <div style="margin-bottom: 60px;">_____________________________</div>
            <div><strong>Firma y Timbre del Médico Veterinario</strong></div>
            <div>${data.vetName}</div>
            <div>RUT: ${data.vetRUT}</div>
        </div>
    </body>
    </html>`;
  }

  private static generateAnnexHTML(data: SAGCertificateData): string {
    const annexTitle = this.getAnnexTitle(data.species);
    const vaccineHeaders = this.getVaccineHeaders(data.species);
    
    return `
    <div class="section" style="page-break-before: always;">
        <div class="section-title">${annexTitle}</div>
        
        <div style="margin-bottom: 20px;">
            <strong>Vacunación</strong>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre vacuna</th>
                        <th>Tipo vacuna**</th>
                        <th>Laboratorio</th>
                        <th>N° serie vacuna</th>
                        <th>Fecha vacunación</th>
                        <th>Vigencia vacuna</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.vaccines.map(vaccine => `
                    <tr>
                        <td>${vaccine.name}</td>
                        <td>${vaccine.type}</td>
                        <td>${vaccine.laboratory}</td>
                        <td>${vaccine.serialNumber}</td>
                        <td>${vaccine.vaccinationDate}</td>
                        <td>${vaccine.validity}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ${data.vaccines.some(v => v.name === 'Antirrábica') ? '<div class="note">* Debe estar respaldada por el certificado original de vacunación antirrábica.</div>' : ''}
            <div class="note">** Tipo: vacuna viva modificada, vacuna inactivada o vacuna mixta.</div>
        </div>

        <div>
            <strong>Desparasitación</strong>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre Producto</th>
                        <th>Laboratorio</th>
                        <th>Principio activo</th>
                        <th>Lote</th>
                        <th>Fecha desparasitación</th>
                        <th>Hora desparasitación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" style="font-weight: bold; background-color: #f0f0f0;">Interna</td>
                    </tr>
                    ${data.deworming.filter(d => d.type === 'internal').map(deworming => `
                    <tr>
                        <td>${deworming.productName}</td>
                        <td>${deworming.laboratory}</td>
                        <td>${deworming.activeIngredient}</td>
                        <td>${deworming.lot}</td>
                        <td>${deworming.dewormingDate}</td>
                        <td>${deworming.dewormingTime}</td>
                    </tr>
                    `).join('')}
                    <tr>
                        <td colspan="6" style="font-weight: bold; background-color: #f0f0f0;">Externa</td>
                    </tr>
                    ${data.deworming.filter(d => d.type === 'external').map(deworming => `
                    <tr>
                        <td>${deworming.productName}</td>
                        <td>${deworming.laboratory}</td>
                        <td>${deworming.activeIngredient}</td>
                        <td>${deworming.lot}</td>
                        <td>${deworming.dewormingDate}</td>
                        <td>${deworming.dewormingTime}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="note">Si el destino final del animal de compañía es Finlandia, Reino Unido, Irlanda o Malta se deberá aplicar un tratamiento antiparasitario efectivo contra el Echinococcus multilocularis.</div>
        </div>
    </div>`;
  }

  private static getAnnexTitle(species: string): string {
    switch (species) {
      case 'Perro': return 'ANEXO 2 - Información del programa de vacunación y desparasitación para CANINOS';
      case 'Gato': return 'ANEXO 1 - Información del programa de vacunación y desparasitación para FELINOS';
      case 'Hurón': return 'ANEXO 3 - Información del programa de vacunación y desparasitación para HURONES';
      default: return 'ANEXO - Información del programa de vacunación y desparasitación';
    }
  }

  private static getVaccineHeaders(species: string): string[] {
    return SPECIES_VACCINES[species as keyof typeof SPECIES_VACCINES] || [];
  }
}