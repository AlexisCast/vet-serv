# mocast-serv

# Getting Started

## Step 1: Start your Application

```bash
# using npm
npm i
npx nodemon app
```

## Tags:
- v1.0.0 “v1.0.0” -> feat/3_Patients_obtainPatientsByOwner -> Branch 1.0.0-rc-1
  - feat/1 -> feat/3
  - compatible with Branch 1.0.0-rc-1 in https://github.com/AlexisCast/vet-react

## FE - BE
-  [feat_11_FE](https://github.com/AlexisCast/vet-react/tree/feat/11_Gender_field_dropdown) -> [feat_6_BE](https://github.com/AlexisCast/vet-serv/tree/feat/6_patients_updates_for_feat_11_FE)
-  [feat_12_FE](https://github.com/AlexisCast/vet-react/tree/feat/12_Species) -> [feat_7_BE](https://github.com/AlexisCast/vet-serv/tree/feat/7_species_for_feat_12_FE)
-  [feat_17_FE](https://github.com/AlexisCast/vet-react/tree/feat/17_TableModules_and_update_TableCost_AdminastrationMedTable_RecordForm) -> [feat_8_BE](https://github.com/AlexisCast/vet-serv/tree/feat/8_records_post_for_feat_17_FE)
-  [feat_18_FE](https://github.com/AlexisCast/vet-react/tree/feat/18_Records_page_and_RecordsTable) -> [feat_9_BE](https://github.com/AlexisCast/vet-serv/tree/feat/9_records_get_for_feat_18_FE)
-  [feat_19_FE](https://github.com/AlexisCast/vet-react/tree/feat/19_EditRecord_page) -> [feat_10_BE](https://github.com/AlexisCast/vet-serv/tree/feat/10_records_get_obtainRecord_for_feat_19_FE)
-  [feat_20_FE](https://github.com/AlexisCast/vet-react/tree/feat/20_EditRecord_page_update_record) -  [feat_21_FE](https://github.com/AlexisCast/vet-react/tree/feat/21_DeleteRecord) -> [feat_12_BE](https://github.com/AlexisCast/vet-serv/tree/feat/12_records_delete_record_for_feat_21_FE)
-  [feat_26_FE](https://github.com/AlexisCast/vet-react/tree/feat/26_InputSearch_Patients) -> [feat_13_BE](https://github.com/AlexisCast/vet-serv/tree/feat/13_searchPatients_Patients_controller_for_feat_26_FE)
-  [feat_27_FE](https://github.com/AlexisCast/vet-react/tree/feat/27_OwnersTable_RecordsTableUpdate) -> [feat_13_BE](https://github.com/AlexisCast/vet-serv/tree/feat/14_owners_records_updated_for_feat_27_FE)
-  [feat_28_FE](https://github.com/AlexisCast/vet-react/tree/feat/29_InputSearch_Owners_and_Update_Owner_Record_Tables_and_show_deleted_results) -> [feat_14_BE](https://github.com/AlexisCast/vet-serv/tree/feat/14_owners_records_search_controllers%2Cupdated_for_feat_28_FE)

## Env File:

- MONGODB_CNN: <mongodb+srv://...>
- SECRETEORPRIVATEKEY: used for jwt.verify

- GOOGLE_CLIENT_ID= GoogleCloud -> API's & Services -> Credentials -> Cliend ID
- GOOGLE_SECRET_ID= GoogleCloud -> API's & Services -> Credentials -> Cliend secrete

- CLOUDINARY_URL= https://console.cloudinary.com/ -> Dashboard -> API Environment variable <cloudinary://....>

- NODEMAILER_AUTH_USER= google email
- NODEMAILER_AUTH_PASS= Google Account -> Security -> App password
- NODEMAILER_FROM= google email

- CLIENT_URL=http//...

https://miracleio.me/snippets/use-gmail-with-nodemailer/

```bash

PORT=8080
MONGODB_CNN=
SECRETEORPRIVATEKEY=

GOOGLE_CLIENT_ID=
GOOGLE_SECRET_ID=

CLOUDINARY_URL=


NODEMAILER_AUTH_USER=
NODEMAILER_AUTH_PASS=
NODEMAILER_FROM=

CLIENT_URL=http://localhost:3000
```
