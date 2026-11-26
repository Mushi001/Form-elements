import React, { useState } from "react";
import {
  Alert, SafeAreaView, ScrollView, View, Text, TextInput,
  Pressable, Switch, StyleSheet
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

type Values = Record<string, string | boolean>;
type Field = {
  key: string; label: string; placeholder?: string; required?: boolean;
  options?: string[]; multiline?: boolean; type?: "email" | "phone" | "number" | "date" | "password" | "pin" | "file";
};

const initial: Values = {};

const forms: { title: string; fields: Field[] }[] = [
  {
    title: "Exercise 1 – User Registration",
    fields: [
      { key: "fullName", label: "Full Name", required: true },
      { key: "email", label: "Email", required: true, type: "email" },
      { key: "password", label: "Password", required: true, type: "password" },
      { key: "confirmPassword", label: "Confirm Password", required: true, type: "password" },
      { key: "phone", label: "Phone Number", required: true, type: "phone" },
      { key: "terms", label: "I accept the terms and conditions", required: true },
    ],
  },
  {
    title: "Exercise 2 – Student Admission",
    fields: [
      { key: "studentName", label: "Student Name", required: true },
      { key: "dob", label: "Date of Birth (YYYY-MM-DD)", required: true, type: "date" },
      { key: "gender", label: "Gender", required: true, options: ["Male", "Female", "Other"] },
      { key: "nationality", label: "Nationality", required: true },
      { key: "email", label: "Email", required: true, type: "email" },
      { key: "phone", label: "Phone", required: true, type: "phone" },
      { key: "previousSchool", label: "Previous School", required: true },
      { key: "program", label: "Program", required: true, options: ["Software Development", "Networking", "Electronics", "Other"] },
      { key: "score", label: "Academic Score (0–100)", required: true, type: "number" },
    ],
  },
  {
    title: "Exercise 3 – Online Banking Transfer",
    fields: [
      { key: "accountName", label: "Account Name", required: true },
      { key: "accountNumber", label: "Account Number", required: true, type: "number" },
      { key: "amount", label: "Amount", required: true, type: "number" },
      { key: "currency", label: "Currency", required: true, options: ["RWF", "USD", "EUR"] },
      { key: "description", label: "Transfer Description (optional, max 100 characters)", multiline: true },
      { key: "pin", label: "PIN (exactly 4 digits)", required: true, type: "pin" },
    ],
  },
  {
    title: "Exercise 4 – Hospital Appointment",
    fields: [
      { key: "patientName", label: "Patient Name", required: true },
      { key: "phone", label: "Phone Number", required: true, type: "phone" },
      { key: "email", label: "Email (optional)", type: "email" },
      { key: "department", label: "Department", required: true, options: ["General Medicine", "Pediatrics", "Dentistry", "Cardiology", "Other"] },
      { key: "doctor", label: "Doctor", required: true },
      { key: "appointmentDate", label: "Appointment Date (YYYY-MM-DD)", required: true, type: "date" },
      { key: "appointmentTime", label: "Appointment Time (e.g. 09:30)", required: true },
      { key: "reason", label: "Reason for Visit (minimum 10 characters)", required: true, multiline: true },
    ],
  },
  {
    title: "Exercise 5 – Job Application",
    fields: [
      { key: "fullName", label: "Full Name", required: true },
      { key: "email", label: "Email", required: true, type: "email" },
      { key: "phone", label: "Phone", required: true, type: "phone" },
      { key: "position", label: "Position", required: true },
      { key: "education", label: "Education Level", required: true, options: ["Secondary", "Diploma", "Bachelor's", "Master's", "Other"] },
      { key: "experience", label: "Years of Experience (0 or more)", required: true, type: "number" },
      { key: "coverLetter", label: "Cover Letter (minimum 50 characters)", required: true, multiline: true },
      { key: "cv", label: "CV (PDF or document)", required: true, type: "file" },
    ],
  },
  {
    title: "Exercise 6 – E-Commerce Checkout",
    fields: [
      { key: "customerName", label: "Customer Name", required: true },
      { key: "phone", label: "Phone Number", required: true, type: "phone" },
      { key: "email", label: "Email", required: true, type: "email" },
      { key: "address", label: "Delivery Address", required: true, multiline: true },
      { key: "city", label: "City", required: true },
      { key: "quantity", label: "Product Quantity", required: true, type: "number" },
      { key: "payment", label: "Payment Method", required: true, options: ["Mobile Money", "Credit/Debit Card", "Cash on Delivery"] },
      { key: "delivery", label: "Delivery Option", required: true, options: ["Standard", "Express", "Pickup"] },
    ],
  },
  {
    title: "Exercise 7 – Event Registration",
    fields: [
      { key: "fullName", label: "Full Name", required: true },
      { key: "email", label: "Email", required: true, type: "email" },
      { key: "phone", label: "Phone", required: true, type: "phone" },
      { key: "organization", label: "Organization", required: true },
      { key: "jobTitle", label: "Job Title", required: true },
      { key: "attendance", label: "Attendance Type", required: true, options: ["Physical", "Virtual"] },
      { key: "days", label: "Number of Days (1–3)", required: true, type: "number" },
      { key: "dietary", label: "Dietary Requirement (optional)", multiline: true },
    ],
  },
];

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function validPhone(value: string) {
  return /^\+?[0-9\s-]{7,15}$/.test(value);
}
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export default function App() {
  const [screen, setScreen] = useState(0);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const current = forms[screen];
  const update = (key: string, value: string | boolean) => {
    setValues(old => ({ ...old, [key]: value }));
    setErrors(old => ({ ...old, [key]: "" }));
  };

  const pickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) update("cv", result.assets[0].name);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    const v = (key: string) => String(values[key] ?? "").trim();

    current.fields.forEach(field => {
      const value = v(field.key);
      if (field.required && field.key === "terms" && values.terms !== true) {
        next.terms = "You must accept the terms and conditions.";
        return;
      }
      if (field.required && field.key !== "terms" && !value) {
        next[field.key] = `${field.label.split(" (")[0]} is required.`;
        return;
      }
      if (!value) return;

      if (field.type === "email" && !validEmail(value))
        next[field.key] = "Please enter a valid email address.";
      if (field.type === "phone" && !validPhone(value))
        next[field.key] = "Please enter a valid phone number.";
      if (field.type === "number" && !/^\d+(\.\d+)?$/.test(value))
        next[field.key] = "Please enter a valid number.";
      if (field.key === "fullName" && screen === 0 && value.length < 3)
        next[field.key] = "Full name must contain at least 3 characters.";
      if (field.key === "password" && value.length < 8)
        next[field.key] = "Password must contain at least 8 characters.";
      if (field.key === "confirmPassword" && value !== v("password"))
        next[field.key] = "Passwords do not match.";
      if (field.key === "accountNumber" && !/^\d+$/.test(value))
        next[field.key] = "Account number must contain numbers only.";
      if (field.key === "amount" && Number(value) <= 0)
        next[field.key] = "Amount must be greater than 0.";
      if (field.key === "pin" && !/^\d{4}$/.test(value))
        next[field.key] = "PIN must contain exactly 4 digits.";
      if (field.key === "score" && (Number(value) < 0 || Number(value) > 100))
        next[field.key] = "Academic score must be between 0 and 100.";
      if (field.key === "score" && Number(value) < 50)
        next[field.key] = "Academic score must be at least 50 for the application to proceed.";
      if (field.key === "description" && value.length > 100)
        next[field.key] = "Description must not exceed 100 characters.";
      if (field.key === "appointmentDate") {
        if (!validDate(value)) next[field.key] = "Enter a valid date in YYYY-MM-DD format.";
        else if (new Date(value + "T00:00:00") < new Date(new Date().toDateString()))
          next[field.key] = "Appointment date cannot be in the past.";
      }
      if (field.key === "reason" && value.length < 10)
        next[field.key] = "Reason must contain at least 10 characters.";
      if (field.key === "experience" && Number(value) < 0)
        next[field.key] = "Years of experience must be 0 or greater.";
      if (field.key === "coverLetter" && value.length < 50)
        next[field.key] = "Cover letter must contain at least 50 characters.";
      if (field.key === "quantity" && Number(value) <= 0)
        next[field.key] = "Quantity must be greater than 0.";
      if (field.key === "days" && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 3))
        next[field.key] = "Number of days must be between 1 and 3.";
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    if (screen === 2) {
      Alert.alert(
        "Confirm Transfer",
        `Transfer ${values.amount} ${values.currency} to ${values.accountName} (${values.accountNumber})?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Confirm", onPress: () => Alert.alert("Transfer Confirmed", "Your transfer details have been accepted.") },
        ]
      );
      return;
    }
    if (screen === 6) {
      Alert.alert(
        "Registration Successful",
        `Name: ${values.fullName}\nOrganization: ${values.organization}\nAttendance: ${values.attendance}\nDays: ${values.days}`
      );
      return;
    }
    if (screen === 5) {
      Alert.alert("Order Summary", `Customer: ${values.customerName}\nQuantity: ${values.quantity}\nPayment: ${values.payment}\nDelivery: ${values.delivery}`);
      return;
    }
    if (screen === 4) {
      Alert.alert("Application submitted successfully", "Your job application has been received.");
      return;
    }
    if (screen === 1) {
      Alert.alert("Admission Submitted", "Student application submitted successfully.");
      return;
    }
    if (screen === 3) {
      Alert.alert("Appointment Requested", "Your appointment request has been submitted.");
      return;
    }
    Alert.alert("Registration Successful", "Your account registration details are valid.");
  };

  const renderField = (field: Field) => {
    const error = errors[field.key];
    const value = values[field.key];
    return (
      <View key={field.key} style={styles.field}>
        <Text style={styles.label}>{field.label}</Text>
        {field.key === "terms" ? (
          <View style={styles.switchRow}>
            <Switch value={value === true} onValueChange={checked => update(field.key, checked)} />
            <Text style={styles.normal}>Accept terms and conditions</Text>
          </View>
        ) : field.type === "file" ? (
          <Pressable style={styles.fileButton} onPress={pickCV}>
            <Text style={styles.buttonText}>{value ? `Selected: ${value}` : "Choose CV document"}</Text>
          </Pressable>
        ) : field.options ? (
          <View style={styles.options}>
            {field.options.map(option => (
              <Pressable key={option}
                style={[styles.option, value === option && styles.optionSelected]}
                onPress={() => update(field.key, option)}>
                <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <TextInput
            style={[styles.input, field.multiline && styles.multiline]}
            value={String(value ?? "")}
            onChangeText={text => update(field.key, text)}
            placeholder={field.placeholder ?? field.label}
            keyboardType={field.type === "email" ? "email-address" :
              field.type === "phone" || field.type === "number" || field.type === "pin" ? "numeric" : "default"}
            secureTextEntry={field.type === "password" || field.type === "pin"}
            autoCapitalize={field.type === "email" ? "none" : "sentences"}
            multiline={field.multiline}
          />
        )}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  };

  const changeScreen = (next: number) => {
    setScreen(next);
    setValues({});
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>React Native Forms</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {forms.map((form, index) => (
            <Pressable key={index} onPress={() => changeScreen(index)}
              style={[styles.tab, screen === index && styles.activeTab]}>
              <Text style={[styles.tabText, screen === index && styles.activeTabText]}>{`Q${index + 1}`}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.instruction}>Complete the fields below. Required fields must be valid before submission.</Text>
        {current.fields.map(renderField)}
        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        <Text style={styles.note}>Use the Q1–Q7 buttons to switch between the seven exercises.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  content: { padding: 18, paddingBottom: 40 },
  heading: { fontSize: 25, fontWeight: "bold", color: "#17324d", marginBottom: 16 },
  tabs: { flexGrow: 0, marginBottom: 20 },
  tab: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#e0e5eb", borderRadius: 8, marginRight: 8 },
  activeTab: { backgroundColor: "#1769aa" },
  tabText: { color: "#17324d", fontWeight: "bold" },
  activeTabText: { color: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#17324d" },
  instruction: { color: "#52606d", marginBottom: 18 },
  field: { marginBottom: 15 },
  label: { fontWeight: "600", color: "#243746", marginBottom: 7 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#cbd2d9", borderRadius: 7, padding: 12, fontSize: 16 },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  error: { color: "#c62828", marginTop: 5, fontSize: 13 },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  normal: { color: "#243746" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { paddingVertical: 9, paddingHorizontal: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#cbd2d9", borderRadius: 7 },
  optionSelected: { backgroundColor: "#1769aa", borderColor: "#1769aa" },
  optionText: { color: "#243746" },
  optionTextSelected: { color: "#fff" },
  fileButton: { padding: 13, backgroundColor: "#526d82", borderRadius: 7, alignItems: "center" },
  submit: { backgroundColor: "#1769aa", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  note: { color: "#657786", marginTop: 16, textAlign: "center" },
});
