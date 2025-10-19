const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://charlesbautista004_db_user:Y0habloespanyol@cluster0.meipbo0.mongodb.net/samutsari?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("✅ MongoDB connected");

    // --- START: Seed static admin & seller accounts (resilient, development only) ---
    (async function seedAccounts() {
      try {
        // Admin model: use existing Admin model if present, otherwise create a minimal one
        const adminSchema = new mongoose.Schema({
          email: { type: String, unique: true },
          password: String,
          name: String,
          role: { type: String, default: "admin" },
        }, { timestamps: true });
        const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

        const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@samutsari.local";
        const ADMIN_PASS = process.env.SEED_ADMIN_PASS || "Admin@1234";
        const NEW_ADMIN_EMAIL = "admin1@gmail.com";
        const NEW_ADMIN_PASS = "12345";

        // Hash admin passwords
        const hashedAdmin = await bcrypt.hash(ADMIN_PASS, 10);
        const hashedNewAdmin = await bcrypt.hash(NEW_ADMIN_PASS, 10);

        // Use updateOne with upsert for Admin to avoid duplicate inserts and let Mongoose handle admin validation
        await Admin.updateOne(
          { email: ADMIN_EMAIL },
          { $setOnInsert: { email: ADMIN_EMAIL, password: hashedAdmin, name: "Site Admin", role: "admin" } },
          { upsert: true }
        );
        console.log(`✅ Ensured admin: ${ADMIN_EMAIL}`);

        await Admin.updateOne(
          { email: NEW_ADMIN_EMAIL },
          { $setOnInsert: { email: NEW_ADMIN_EMAIL, password: hashedNewAdmin, name: "Admin One", role: "admin" } },
          { upsert: true }
        );
        console.log(`✅ Ensured admin: ${NEW_ADMIN_EMAIL}`);

        // Sellers: write directly to the collection to bypass Mongoose model validation mismatches.
        // This ensures seeding won't fail if the project's Seller schema requires fields we're not aware of.
        const SELLER_EMAIL = process.env.SEED_SELLER_EMAIL || "seller@samutsari.local";
        const SELLER_PASS = process.env.SEED_SELLER_PASS || "Seller@1234";
        const NEW_SELLER_EMAIL = "seller1@gmail.com";
        const NEW_SELLER_PASS = "12345";

        const hashedSeller = await bcrypt.hash(SELLER_PASS, 10);
        const hashedNewSeller = await bcrypt.hash(NEW_SELLER_PASS, 10);

        const sellersColl = mongoose.connection.collection("sellers");

        // Use $setOnInsert so we don't overwrite existing docs
        await sellersColl.updateOne(
          { email: SELLER_EMAIL },
          { $setOnInsert: {
              email: SELLER_EMAIL,
              password: hashedSeller,
              name: "Sample Seller",
              username: "sample_seller",
              shopName: "Sample Shop",
              contact: "09991234567",
              role: "seller",
              createdAt: new Date(),
              updatedAt: new Date()
          } },
          { upsert: true }
        );
        console.log(`✅ Ensured seller: ${SELLER_EMAIL}`);

        await sellersColl.updateOne(
          { email: NEW_SELLER_EMAIL },
          { $setOnInsert: {
              email: NEW_SELLER_EMAIL,
              password: hashedNewSeller,
              name: "Seller One",
              username: "seller1",
              shopName: "Seller One Shop",
              contact: "09990001111",
              role: "seller",
              createdAt: new Date(),
              updatedAt: new Date()
          } },
          { upsert: true }
        );
        console.log(`✅ Ensured seller: ${NEW_SELLER_EMAIL}`);

        console.warn("⚠️ Seeded static credentials are for development only. Change them before deploying to production.");
      } catch (err) {
        console.error("❌ Error seeding accounts:", err);
      }
    })();
    // --- END: Seed static admin & seller accounts ---
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ✅ Session (stored in MongoDB)
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://charlesbautista004_db_user:Y0habloespanyol@cluster0.meipbo0.mongodb.net/samutsari?retryWrites=true&w=majority",
    }),
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// --- START: Development-only shortcuts to allow admin/seller login with any password ---
// These routes accept any password and set a session for quick development/testing.
// Remove or secure them before deploying to production.
app.post('/admin/login', (req, res) => {
	// Accepts { email, password } but ignores password
	const email = (req.body && req.body.email) || 'admin@local';
	req.session.admin = { email };
	// Persist session then redirect
	req.session.save(err => {
		if (err) console.error('Session save error (admin login):', err);
		return res.redirect('/admin/dashboard');
	});
});

app.post('/seller/login', (req, res) => {
	// Accepts { email, password } but ignores password
	const email = (req.body && req.body.email) || 'seller@local';
	req.session.seller = { email };
	req.session.save(err => {
		if (err) console.error('Session save error (seller login):', err);
		return res.redirect('/seller/dashboard');
	});
});
// --- END: Development-only shortcuts ---

// ✅ Routes
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", sellerRoutes);
app.use("/", adminRoutes);

// --- REPLACED: consolidate root & logout handlers, removed duplicates ---
app.get("/logout", (req, res) => {
	// Destroy session and redirect back to homepage
	req.session.destroy(err => {
		if (err) {
			console.error("Error destroying session during logout:", err);
			res.clearCookie("connect.sid");
			return res.redirect("/homepage");
		}
		res.clearCookie("connect.sid");
		return res.redirect("/homepage");
	});
});

// Serve index.ejs as the landing page for all visitors at the root path
app.get("/", (req, res) => {
	return res.render("index");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
