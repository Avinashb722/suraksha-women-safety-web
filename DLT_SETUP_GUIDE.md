# 📋 DLT Setup for Suraksha Emergency SMS

## 🎯 Get DLT Sender ID for Suraksha

### **Step 1: Register Sender ID**
1. Go to Fast2SMS → **DLT SMS** section
2. Click **"Add Sender ID"**
3. Enter details:
   - **Sender ID:** `SURKSH` (6 chars max)
   - **Entity Type:** Service
   - **Category:** Service Implicit
   - **Purpose:** Emergency alerts

### **Step 2: Register Message Template**
1. Click **"Add Template"**
2. Template content:
```
🚨 EMERGENCY: {#var#} needs help! Location: {#var#} Maps: {#var#}
```
3. **Category:** Service Implicit
4. **Template Type:** Service Explicit

### **Step 3: Get Template ID**
After approval, you'll get:
- **Sender ID:** `SURKSH`
- **Template ID:** (e.g., `1234567890123456789`)

### **Step 4: Update Code**
```javascript
const data = JSON.stringify({
    route: 'dlt',
    message: message,
    language: 'english',
    flash: 0,
    numbers: phoneNumber,
    sender: 'SURKSH',           // Your approved sender ID
    template_id: '1234567890123456789'  // Your template ID
});
```

### **Alternative: Use Pre-approved Sender**
For immediate testing, try common sender IDs:
- `TXTLCL` (TextLocal)
- `SMSGAT` (SMS Gateway)
- `ALERTS` (Generic alerts)

### **Cost Comparison:**
- **Quick SMS:** ₹15 per SMS
- **DLT SMS:** ₹0.25 per SMS (60x cheaper!)

## 🚀 Immediate Action
1. **Register DLT now** (takes 1-3 days)
2. **Use Quick SMS** for current testing
3. **Switch to DLT** once approved

**Status:** DLT registration in progress for cost-effective SMS! 📱💰