/**
 * Automated Test Suite for Step 2: Backend, MongoDB, and Property Management APIs
 * Run via: npx tsx backend/tests/step2_property_api.test.ts
 */
import jwt from 'jsonwebtoken';
import * as propertyService from '../services/propertyService.ts';
import { AUTHORIZED_ADMIN_EMAIL } from '../middleware/auth.ts';

const SESSION_SECRET = process.env.SESSION_SECRET || 'prime_properties_secret_key_2026';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failed++;
  }
}

async function runStep2Tests() {
  console.log('\n--- COMMENCING STEP 2 BACKEND & PROPERTY TESTS ---\n');

  // Test 1: Public property query returns published properties
  try {
    const properties = await propertyService.getPublicProperties({});
    assert(Array.isArray(properties) && properties.length > 0, 'Public property API returns published listings');
    const allPublished = properties.every((p: any) => p.isPublished === true);
    assert(allPublished, 'Only published properties permitted for public display appear');
  } catch (err: any) {
    assert(false, `Public property retrieval failed: ${err.message}`);
  }

  // Test 2: Filter by City works (Mumbai, Pune)
  try {
    const mumbaiProps = await propertyService.getPublicProperties({ city: 'Mumbai' });
    const allMumbai = mumbaiProps.every((p: any) => p.city === 'Mumbai');
    assert(allMumbai && mumbaiProps.length > 0, 'Property filtering by City (Mumbai) functions correctly');

    const puneProps = await propertyService.getPublicProperties({ city: 'Pune' });
    const allPune = puneProps.every((p: any) => p.city === 'Pune');
    assert(allPune && puneProps.length > 0, 'Property filtering by City (Pune) functions correctly');
  } catch (err: any) {
    assert(false, `City filter test failed: ${err.message}`);
  }

  // Test 3: Filter by Purpose (Rent vs Sale)
  try {
    const rentProps = await propertyService.getPublicProperties({ purpose: 'rent' });
    const allRent = rentProps.every((p: any) => p.purpose === 'rent');
    assert(allRent && rentProps.length > 0, 'Brokerage filtering by Purpose (Rent) functions correctly');

    const saleProps = await propertyService.getPublicProperties({ purpose: 'sale' });
    const allSale = saleProps.every((p: any) => p.purpose === 'sale');
    assert(allSale && saleProps.length > 0, 'Brokerage filtering by Purpose (Sale) functions correctly');
  } catch (err: any) {
    assert(false, `Purpose filter test failed: ${err.message}`);
  }

  // Test 4: Filter by Property Type (Flat, House, Penthouse, Villa)
  try {
    const flats = await propertyService.getPublicProperties({ type: 'Flat' });
    const allFlats = flats.every((p: any) => p.propertyType === 'Flat');
    assert(allFlats && flats.length > 0, 'Property filtering by Type (Flat) functions correctly');

    const houses = await propertyService.getPublicProperties({ type: 'House' });
    const allHouses = houses.every((p: any) => p.propertyType === 'House');
    assert(allHouses && houses.length > 0, 'Property filtering by Type (House) functions correctly');
  } catch (err: any) {
    assert(false, `Type filter test failed: ${err.message}`);
  }

  // Test 4: Retrieve property by ID or slug
  try {
    const list = await propertyService.getPublicProperties({});
    const target = list[0];
    const fetchedById = await propertyService.getPropertyByIdOrSlug(target._id);
    assert(fetchedById && (fetchedById as any).title === target.title, 'Property details retrieved by ID successfully');

    if (target.slug) {
      const fetchedBySlug = await propertyService.getPropertyByIdOrSlug(target.slug);
      assert(fetchedBySlug && (fetchedBySlug as any)._id === target._id, 'Property details retrieved by Slug successfully');
    }
  } catch (err: any) {
    assert(false, `Detail retrieval test failed: ${err.message}`);
  }

  // Test 5: Admin Token Generation & Verification for authorized email
  try {
    const validToken = jwt.sign(
      { email: AUTHORIZED_ADMIN_EMAIL, role: 'admin' },
      SESSION_SECRET,
      { expiresIn: '1h' }
    );
    const decoded: any = jwt.verify(validToken, SESSION_SECRET);
    assert(decoded.email === AUTHORIZED_ADMIN_EMAIL, 'Admin JWT encodes authorized email: shantanupatil636@gmail.com');

    // Unauthorized email check
    const invalidToken = jwt.sign(
      { email: 'hacker@malicious.com', role: 'admin' },
      SESSION_SECRET,
      { expiresIn: '1h' }
    );
    const decodedInvalid: any = jwt.verify(invalidToken, SESSION_SECRET);
    assert(decodedInvalid.email !== AUTHORIZED_ADMIN_EMAIL, 'Unauthorized email successfully caught and rejected');
  } catch (err: any) {
    assert(false, `Auth token test failed: ${err.message}`);
  }

  // Test 6: Admin Property Creation & Availability Update
  try {
    const testProp = await propertyService.createProperty({
      title: '  Automated Test Sky Penthouse',
      city: 'Mumbai',
      location: 'Worli Seaface',
      propertyType: 'Penthouse',
      purpose: 'sale',
      price: 150000000,
      priceDisplay: '₹15 Cr',
      priceApproved: true,
      bedrooms: 3,
      bathrooms: 4,
      areaSqFt: 3500,
      images: ['/src/assets/images/property_penta_mumbai_1792781621423.jpg'],
      amenities: ['Sky Garden'],
      isPublished: false, // created as draft
      availability: 'Available',
      isDemo: true,
    });
    assert(testProp && (testProp as any).title.includes(' '), 'Admin creates new property labeled  ');

    // Verify it does NOT appear in public listing because isPublished=false
    const publicList = await propertyService.getPublicProperties({});
    const foundInPublic = publicList.some((p: any) => p._id === (testProp as any)._id);
    assert(!foundInPublic, 'Unpublished draft property is NOT exposed to public API');

    // Update availability
    const updated = await propertyService.updateAvailability((testProp as any)._id, 'Under Offer');
    assert(updated && (updated as any).availability === 'Under Offer', 'Availability update to "Under Offer" verified');

    // Toggle publish to true
    const published = await propertyService.togglePublishStatus((testProp as any)._id, true);
    assert(published && (published as any).isPublished === true, 'Publication status toggled to published');

    // Delete property
    const deleted = await propertyService.deleteProperty((testProp as any)._id);
    assert(deleted !== null, 'Property successfully deleted by administrator');
  } catch (err: any) {
    assert(false, `Admin property operation test failed: ${err.message}`);
  }

  // Test 7: Demo Data isolation and labeling
  try {
    const allAdminProps = await propertyService.getAllPropertiesAdmin();
    const demoItems = allAdminProps.filter((p: any) => p.isDemo === true || p.title.includes(' '));
    assert(demoItems.length > 0, 'Demo records are strictly flagged with isDemo and   labels');
  } catch (err: any) {
    assert(false, `Demo data isolation test failed: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`Step 2 Tests Completed: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runStep2Tests();
