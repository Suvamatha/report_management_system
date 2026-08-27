 ### Key System Architecture & Highlights                                                                                            
                                                                                                                                      
  #### 1. Hospital Profile & Header                                                                                                   
                                                                                                                                      
  • Configurable Hospital Settings: Default configured for Tribhuvan University Teaching Hospital, Department of Pulmonology &        
  Critical Care Medicine, Maharajgunj, Kathmandu.                                                                                     
  • Hospital Settings Drawer: Allows administrators and doctors to update hospital name, department, address, phone number, email, and
  Report ID prefix (e.g., BR-2026-).                                                                                                  
                                                                                                                                      
  #### 2. Patient & Visit Information                                                                                                 
                                                                                                                                      
  • Patient Demographics: Patient ID (validated & searchable), Full Name, Age, and Gender selector (Male | Female | Other).           
  • Visit Details: Editable Visit Date (defaults to current date), Referred By, and Consulted By dropdown populated from configured   
  doctor profiles.                                                                                                                    
  • Patient Directory & History Modal: Search patients by ID or Name to view patient demographics and past procedure history timeline.
                                                                                                                                      
  #### 3. Procedure Details                                                                                                           
                                                                                                                                      
  • Premedication & Sedation: Free-text clinical fields for custom airway anesthesia and sedation regimens.                           
  • Access Route: Controlled pills (Oral, Nasal, Other with custom text input).                                                       
                                                                                                                                      
  #### 4. Radiological CT Findings & Clinical Indication                                                                              
                                                                                                                                      
  • CT Findings: Multiline text area with quick-tag insertion for common radiological findings (Solitary pulmonary nodule, Ground     
  glass opacities, Mediastinal lymphadenopathy, etc.).                                                                                
  • Clinical Indication: Multiline text area with quick clinical indication tags (Hemoptysis, Persistent cough, TB workup, ILD workup).
                                                                                                                                      
  #### 5. Structured Bronchoscopic Anatomical Findings                                                                                
                                                                                                                                      
  • 10 Anatomical Locations:                                                                                                          
      1. Vocal Cord                                                                                                                   
      2. Trachea                                                                                                                      
      3. Carina                                                                                                                       
      4. Tracheobronchial Tree (Supports "Normal TBT" option)                                                                         
      5. Right Upper Lobe                                                                                                             
      6. Right Middle Lobe                                                                                                            
      7. Right Lower Lobe                                                                                                             
      8. Left Upper Lobe                                                                                                              
      9. Lingular Lobe                                                                                                                
      10. Left Lower Lobe                                                                                                             
  • Fast Clinical Workflow: Each row has a Normal / Abnormal / Custom selector.                                                       
  • Deliberate Action: Includes a "Mark Unset as Normal" button to rapidly complete normal baseline locations without overwriting     
  customized findings.                                                                                                                
  • Expandable Details: Selecting Abnormal or Custom opens a dedicated clinical text area for detailed observations.                  
                                                                                                                                      
  #### 6. Interventions & Sample Collection                                                                                           
                                                                                                                                      
  • BAL (Bronchoalveolar Lavage): Done/Not Done toggle, Sample Site/Segment, Specimen/Tests, and Notes.                               
  • Endobronchial Biopsy: Done/Not Done toggle, Site, Specimen/Notes.                                                                 
  • Conventional TBNA: Done/Not Done toggle, Station/Site, Specimen/Tests, Notes.                                                     
  • Bronchial Brushing: Done/Not Done toggle, Site, Notes.                                                                            
                                                                                                                                      
  #### 7. Medical Image Management (IndexedDB Storage)                                                                                
                                                                                                                                      
  • Upload: Drag-and-drop zone and file picker supporting JPG, JPEG, PNG, and WebP images.                                            
  • Validation: File format checking and maximum file size validation (up to 10MB per image) with clear error alerts.                 
  • Storage: High-resolution image binary Blobs are stored in IndexedDB (avoiding localStorage quota errors).                         
  • Tools: Image numbering (#1, #2), customizable captions, 90° rotation, reordering (move left/right), and deletion.                 
                                                                                                                                      
  #### 8. Impression & Advice (No Automated AI Diagnosis)                                                                             
                                                                                                                                      
  • Free-text Impression and Advice fields. The attending physician retains full diagnostic responsibility.                           
                                                                                                                                      
  #### 9. Doctor Profiles & Digital Signatures                                                                                        
                                                                                                                                      
  • Doctor Profile Management: Configure doctor name, designation, credentials, department, default status, and digital signature     
  images.                                                                                                                             
                                                                                                                                      
  #### 10. Document Generation & Export                                                                                               
                                                                                                                                      
  • A4 Print Engine: Dedicated @media print layout styled to standard A4 dimensions.                                                  
  • Client-Side Word Export (.docx): Uses the docx library to generate native Microsoft Word documents containing tables, medical     
  images with captions, headers, and footers.                                                                                         
  • PDF Export: Integrated browser PDF export driver.                                                                                 
                                                                                                                                      
  #### 11. Report Lifecycle, Versioning & Audit Logs                                                                                  
                                                                                                                                      
  • States: Draft, Completed, Amended.                                                                                                
  • Debounced Autosave: Saves changes automatically in the background with status feedback ("Saving...", "Saved", "Last saved at 1:42 
  PM").                                                                                                                               
  • Finalize Workflow: Finalizing locks the clinical record and requires creating an official amendment (v2+) for subsequent updates. 
  • Security & Audit Logs: Local immutable audit log tracking report creations, updates, finalizations, amendments, exports, and      
  deletions.                                                                                                                          
  • Backup & Restore: Export all IndexedDB databases (reports, images, patients, settings) to a single downloadable .json backup file 
  for data protection.                                                                                                                
  ──────                                                                                                                              
  ### Project File Structure                                                                                                          
                                                                                                                                      
    /home/suvam/Desktop/report/                                                                                                       
    ├── src/                                                                                                                          
    │   ├── types/                                                                                                                    
    │   │   └── index.ts                 # Full TypeScript domain models                                                              
    │   ├── services/                                                                                                                 
    │   │   ├── storage/                                                                                                              
    │   │   │   ├── db.ts                # IndexedDB database schema                                                                  
    │   │   │   ├── reportRepository.ts  # Report repository CRUD & versioning                                                        
    │   │   │   ├── patientRepository.ts # Patient directory & lookup                                                                 
    │   │   │   ├── doctorRepository.ts  # Doctor profiles & signatures                                                               
    │   │   │   ├── hospitalRepository.ts# Hospital branding configuration                                                            
    │   │   │   ├── templateRepository.ts# Procedure templates repository                                                             
    │   │   │   ├── imageStorage.ts      # Image Blob storage & validation                                                            
    │   │   │   ├── auditService.ts      # Security audit log service                                                                 
    │   │   │   └── backupService.ts     # JSON backup & restore engine                                                               
    │   │   └── documents/                                                                                                            
    │   │       ├── docxExporter.ts      # Client-side Word (.docx) generator                                                         
    │   │       └── pdfExporter.ts       # Print & PDF trigger                                                                        
    │   ├── components/                                                                                                               
    │   │   ├── ui/                      # Button, Badge, Modal primitives                                                            
    │   │   ├── reports/                                                                                                              
    │   │   │   ├── ReportEditor.tsx     # Main structured editor & section navigation                                                
    │   │   │   ├── MedicalReportPreview.tsx # Live A4 document view                                                                  
    │   │   │   ├── SaveStatus.tsx       # Autosave status indicator                                                                  
    │   │   │   ├── FinalizeModal.tsx    # Finalization confirmation modal                                                            
    │   │   │   └── sections/            # Individual section forms                                                                   
    │   │   ├── dashboard/                                                                                                            
    │   │   │   ├── Dashboard.tsx        # Pulmonology reporting hub                                                                  
    │   │   │   ├── ReportList.tsx       # Interactive reports table                                                                  
    │   │   │   ├── FilterBar.tsx        # Search, doctor & date filters                                                              
    │   │   │   └── StatsCards.tsx       # Overview metrics                                                                           
    │   │   ├── patients/                                                                                                             
    │   │   │   └── PatientHistoryModal.tsx # Patient lookup & procedure timeline                                                     
    │   │   ├── settings/                                                                                                             
    │   │   │   ├── HospitalSettingsModal.tsx                                                                                         
    │   │   │   └── DoctorProfilesModal.tsx                                                                                           
    │   │   ├── templates/                                                                                                            
    │   │   │   └── TemplatesModal.tsx  # Procedure templates selector                                                                
    │   │   └── audit/                                                                                                                
    │   │       └── AuditLogsModal.tsx   # Audit logs viewer                                                                          
    │   └── utils/                                                                                                                    
    │       └── seedData.ts              # Clean initial demo data (no real patient data)                                             
    

  I have finalized the Digital Bronchoscopy / Pulmonology Procedure Report System and verified that the production build completes    
  cleanly.                                                                                                                            
                                                                                                                                      
  ### Summary of System Features:                                                                                                     
                                                                                                                                      
  1. Dashboard & Metric Overview:                                                                                                     
      • Live metrics: Total Reports, Completed Reports, Active Drafts, Unique Patients.                                               
      • Comprehensive filter bar supporting Patient Name, Patient ID, Report #, Doctor, Status (Draft, Completed, Amended), and Date  
      Ranges.                                                                                                                         
  2. Structured Clinical Procedure Editor:
      • Configurable Hospital Header: Pre-configured with Tribhuvan University Teaching Hospital, Department of Pulmonology,          
      Maharajgunj, Kathmandu.
      • Patient & Referral Info: Patient ID autocomplete, demographics, visit date, referred by, and attending physician selection.   
      • Procedure Setup: Premedication (free text), Sedation (free text), and Access Route (Oral, Nasal, Other with custom field).    
      • CT Findings & Clinical Indication: Multiline text areas equipped with pulmonology quick tags.
      • Bronchoscopic Findings: 10 anatomical locations (Vocal Cord, Trachea, Carina, Tracheobronchial Tree, Lobes) with status       
      selectors (Normal, Abnormal, Custom), single-click "Mark Unset as Normal" workflow, and expandable detailed finding descriptions.
      • Interventions / Samples: Structured modules for BAL, Endobronchial Biopsy, Conventional TBNA, and Bronchial Brushing.         
      • Medical Image Manager: Drag-and-drop file upload, file format and size validation (up to 10MB per image), IndexedDB image Blob
      storage, 90° image rotation, custom labeling/captioning, reordering, and image numbering.
      • Impression & Advice: Doctor-driven clinical impression and post-procedure care recommendations.
  3. Document Export & Output Systems:
      • Live A4 Preview: On-screen real-time A4 medical document preview and print engine styled with @media print.
      • Microsoft Word (.docx) Export: Native client-side .docx binary document generation using the docx library, complete with      
      header, patient grid, formatted anatomical findings table, sample collection details, embedded images with captions, and doctor 
      sign-off block.
      • PDF & Browser Printing: Direct trigger for browser PDF generation.
  4. Security, Audit & Data Integrity:
      • Debounced Autosave: Automatic background saving with visual status indicators ("Saving...", "Saved", "Last saved at 1:42 PM").
      • Report Finalization & Versioning: Finalizing locks the record; amendments create linked versioned reports (v2+).              
      • Audit Logs: Immutable local audit trail tracking report creations, edits, finalizations, exports, and deletions.              
      • Backup & Restore: Downloadable .json system backup and restore utility for disaster recovery.
  