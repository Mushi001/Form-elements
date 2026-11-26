# React Native Exercises 1–7

This Expo project contains the seven forms from slides 36–42 in one app.
Use the Q1–Q7 tabs to open each exercise.

## Setup

1. Create an Expo TypeScript project:
   `npx create-expo-app@latest FormsApp --template blank-typescript`
2. Replace the generated `App.tsx` with the `App.tsx` in this folder.
3. From the project folder, install the document picker:
   `npx expo install expo-document-picker`
4. Start the app:
   `npx expo start`

## Notes

- The CV field in Question 5 uses Expo Document Picker and accepts PDF/Word documents.
- Dates are entered in `YYYY-MM-DD` format.
- Exercise 3 shows a confirmation prompt before confirming the transfer.
- This is a learning exercise: it validates form data locally and does not connect to real banking, hospital, school, shopping, or recruitment services.
