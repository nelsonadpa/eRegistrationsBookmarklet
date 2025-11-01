Perfect — here’s the **English version** you can paste directly into your `README.md` on GitHub (already formatted for Markdown and clear for developers and non-developers alike):

---

## 🧩 eRegistrations Bookmarklet — Form.io Keys Finder

This bookmarklet helps you **identify all component keys** in a Form.io form (BPA or DS instance).
It highlights components directly on the page and lets you **copy or export** all keys (CSV / JSON).

---

### 🚀 How to Use

1. Open your browser (Chrome, Edge, Firefox).

2. Create a **new bookmark** (⭐) in your bookmarks bar.

3. In the **Name** field, type something like:

   ```
   Formio Keys Finder
   ```

4. In the **URL** field, paste the following code:

v1

   ```javascript
   javascript:(function(){
     const url='https://raw.githubusercontent.com/nelsonadpa/eRegistrationsBookmarklet/main/formio-keys.js';
     fetch(url)
       .then(r=>r.text())
       .then(c=>{try{eval(c);}catch(e){alert("Error executing script:\n"+e);}})
       .catch(e=>alert("Error loading script:\n"+e));
   })();
   ```

v2
   ```javascript
   javascript:(function(){
     const url='https://raw.githubusercontent.com/nelsonadpa/eRegistrationsBookmarklet/main/formio-keys.js';
     fetch(url)
       .then(r=>r.text())
       .then(c=>{try{eval(c);}catch(e){alert("Error executing script:\n"+e);}})
       .catch(e=>alert("Error loading script:\n"+e));
   })();
   ```

6. Save the bookmark.

7. Open any Form.io page (in **DS**, **BPA**, or the **builder**).

8. Click on your new bookmark “Formio Keys Finder.”

   🔹 A small floating window will appear, showing all **detected keys** with options to:

   * **Highlight** components on the page
   * **Copy** all keys to clipboard
   * **Download** as CSV or JSON
   * **Clear highlights**

---

### 🧼 Optional: Cleanup Bookmarklet

You can create a second bookmark to close the interface and clear highlights:


```javascript
javascript:(function(){
  if(window.__formioKeysFinderCleanup){ window.__formioKeysFinderCleanup(); alert("Cleanup completed ✅"); }
  else alert("No highlights currently active.");
})();
```

---

### 📂 Repository

Source code and updates available at:
🔗 [https://github.com/nelsonadpa/eRegistrationsBookmarklet](https://github.com/nelsonadpa/eRegistrationsBookmarklet)

---

Would you like me to make it even more **developer-friendly** (for example, adding a “Quick Demo GIF” placeholder and sections for “Contributing” and “License”)?
