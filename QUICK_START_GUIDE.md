# Quick Start Guide - Dashboard Charts

## 🚀 Get Started in 3 Steps

### Step 1: Start the Servers

```bash
# Terminal 1 - Start Backend
npm run dev:backend

# Terminal 2 - Start Frontend  
npm run dev:frontend
```

### Step 2: Login

1. Open browser: `http://localhost:5173` (or the port shown in terminal)
2. Login with:
   - **Email**: admin@school.com
   - **Password**: admin123

### Step 3: View Charts

1. You're already on the dashboard!
2. Scroll down to see the "Analytics Overview" section
3. Charts will load automatically

That's it! 🎉

---

## 📊 What You'll See

### 5 Interactive Charts

1. **Students by Class** - Bar chart showing class distribution
2. **Students by Gender** - Donut chart with male/female split
3. **Staff by Role** - Donut chart of staff roles (admin only)
4. **Students by Status** - Bar chart of enrollment status
5. **Enrollment Trend** - Line chart of last 6 months

---

## 🔄 Refresh Data

Click the **"Refresh"** button in the top-right corner to reload all dashboard data including charts.

---

## 🧪 Test the API Directly

### Get Your Token

1. Login through the UI
2. Open browser DevTools (F12)
3. Go to Application > Local Storage
4. Copy the token value

### Test the Endpoint

```bash
curl -X GET http://localhost:3000/api/v1/dashboard/charts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

You should see JSON with chart data!

---

## 📱 Responsive Design

The charts work on all devices:

- **Desktop**: 2-column grid layout
- **Tablet**: Adjusts to screen size
- **Mobile**: Single column, full width

Try resizing your browser to see it in action!

---

## 🎨 Customize Colors

Want different colors? Edit `frontend/src/views/super_admin/Dashboard.vue`:

```vue
<!-- Students by Gender - Change colors -->
<DonutChart
  :colors="['#3b82f6', '#ec4899']"  <!-- Change these! -->
/>

<!-- Students by Status - Change colors -->
<BarChart
  :colors="['#10b981', '#f59e0b', '#ef4444']"  <!-- Change these! -->
/>
```

---

## 🐛 Troubleshooting

### Charts Not Showing?

**Check 1**: Is the backend running?
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"success",...}`

**Check 2**: Are you logged in as admin?
- Only super_admin, admin, and system_owner can see charts

**Check 3**: Is there data in the database?
```bash
npm run db:seed
```

**Check 4**: Check browser console (F12)
- Look for any red error messages

### Empty Charts?

Add some test data:
```bash
cd backend
npx sequelize-cli db:seed:all
```

### Performance Issues?

- Reduce the time range in the enrollment trend query
- Add database indexes on frequently queried columns
- Consider implementing caching

---

## 📚 More Information

- **Full Documentation**: See `CHART_IMPLEMENTATION.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Layout Guide**: See `DASHBOARD_LAYOUT.md`
- **API Docs**: See `backend/API_DOCUMENTATION.md`

---

## 🎯 Next Steps

Now that charts are working, you can:

1. **Add More Data**: Register more students and staff
2. **Customize**: Change colors and styling
3. **Extend**: Add more chart types
4. **Export**: Add PDF/CSV export functionality
5. **Share**: Show it to your team!

---

## 💡 Pro Tips

1. **Hover over charts** to see detailed information
2. **Use the refresh button** to update data without page reload
3. **Check the staff activity table** below charts for real-time staff status
4. **Resize your browser** to see responsive design in action
5. **Open DevTools** to see API calls and responses

---

## 🆘 Need Help?

1. Check the documentation files
2. Review browser console for errors
3. Check backend logs for API errors
4. Verify database connections
5. Ensure all dependencies are installed

---

## ✅ Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173 (or similar)
- [ ] Logged in as super_admin
- [ ] Can see 5 charts on dashboard
- [ ] Charts show data (not empty)
- [ ] Refresh button works
- [ ] Charts are responsive

If all checked, you're good to go! 🎉

---

**Happy Charting!** 📊✨
