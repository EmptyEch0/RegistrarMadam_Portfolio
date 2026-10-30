import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zkiqeyhmoipzqawqqrvv.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraXFleWhtb2lwenFhd3FxcnZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjcyNTQ1MCwiZXhwIjoyMDgyMzAxNDUwfQ.ptlyfuhFDLW0Mp_Aec2Bxks-UPJ2FJAW_EqvLsN6tmc";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function setup() {
  console.log("🔍 Checking existing storage buckets on Supabase...");
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

  if (listError) {
    console.error("❌ Error listing buckets:", listError.message);
    process.exit(1);
  }

  console.log("Current buckets found:", buckets.map((b) => b.name));

  const existing = buckets.find((b) => b.name === "assignments");

  if (existing) {
    console.log("ℹ️ Bucket 'assignments' already exists. Updating settings to public...");
    const { data, error } = await supabaseAdmin.storage.updateBucket("assignments", {
      public: true,
      fileSizeLimit: 1048576, // 1 MB limit
      allowedMimeTypes: ["application/pdf"],
    });

    if (error) {
      console.error("❌ Failed to update bucket:", error.message);
    } else {
      console.log("✅ Bucket 'assignments' is now public and configured!");
    }
  } else {
    console.log("🚀 Creating 'assignments' bucket...");
    const { data, error } = await supabaseAdmin.storage.createBucket("assignments", {
      public: true,
      fileSizeLimit: 1048576, // 1 MB limit per file
      allowedMimeTypes: ["application/pdf"],
    });

    if (error) {
      console.error("❌ Failed to create bucket:", error.message);
      process.exit(1);
    }

    console.log("🎉 Successfully created 'assignments' bucket!", data);
  }

  // Verify list
  const { data: updatedBuckets } = await supabaseAdmin.storage.listBuckets();
  console.log("Updated list of buckets:", updatedBuckets?.map((b) => ({ name: b.name, public: b.public })));
}

setup();

