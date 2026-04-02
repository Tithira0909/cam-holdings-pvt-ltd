import sys
import json
import re

def update_server():
    with open('server.js', 'r') as f:
        content = f.read()

    # Find the POST /api/properties block
    post_search = """
// POST new property
app.post('/api/properties', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
"""
    post_replace = """
// POST new property
app.post('/api/properties', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'blockPlanImage', maxCount: 1 },
    { name: 'roadMapImage', maxCount: 1 },
    { name: 'locationMapImage', maxCount: 1 },
    { name: 'brochureFile', maxCount: 1 }
]), async (req, res) => {
"""

    if post_search in content:
        content = content.replace(post_search, post_replace)

    # POST req.body fields
    body_search = """
      title, slug, location, price, type, status, description,
      category, district, city, locationLabel, priceLabel, bedrooms, bathrooms,
      isFeatured, isSoldOut, videoUrl, hotlineNumber, sortOrder,
      shortDescription, fullDescription,
      amenities, locationHighlights, floorPlans, brochureFiles
"""
    body_replace = """
      title, slug, location, price, type, status, description,
      category, district, city, locationLabel, priceLabel, bedrooms, bathrooms,
      isFeatured, isSoldOut, videoUrl, hotlineNumber, sortOrder,
      shortDescription, fullDescription,
      amenities, locationHighlights, floorPlans, brochureFiles,
      projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
"""

    # We need to replace it carefully in both POST and PUT
    # For POST:
    content = content.replace(body_search, body_replace)

    # Handle file uploads in POST
    file_upload_search = """
    // Handle main image
    let mainImageUrl = null;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
"""
    file_upload_replace = """
    // Handle main image
    let mainImageUrl = null;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
    let logoImageUrl = null;
    if (req.files['logoImage']) {
      logoImageUrl = `/uploads/${req.files['logoImage'][0].filename}`;
    }
    let blockPlanImageUrl = null;
    if (req.files['blockPlanImage']) {
      blockPlanImageUrl = `/uploads/${req.files['blockPlanImage'][0].filename}`;
    }
    let roadMapImageUrl = null;
    if (req.files['roadMapImage']) {
      roadMapImageUrl = `/uploads/${req.files['roadMapImage'][0].filename}`;
    }
    let locationMapImageUrl = null;
    if (req.files['locationMapImage']) {
      locationMapImageUrl = `/uploads/${req.files['locationMapImage'][0].filename}`;
    }
"""
    # Just in POST
    if file_upload_search in content:
        # Avoid duplicate replacement
        content = content.replace(file_upload_search, file_upload_replace)

    # stringify travelHighlights
    str_search = """
    const brochureFilesStr = typeof brochureFiles === 'string' ? brochureFiles : safeStringifyJSON(brochureFiles);
"""
    str_replace = """
    const brochureFilesStr = typeof brochureFiles === 'string' ? brochureFiles : safeStringifyJSON(brochureFiles);
    const travelHighlightsStr = typeof travelHighlights === 'string' ? travelHighlights : safeStringifyJSON(travelHighlights);
    const relatedLandsStr = typeof relatedLands === 'string' ? relatedLands : safeStringifyJSON(relatedLands);
"""
    content = content.replace(str_search, str_replace)

    # SQL INSERT
    sql_insert_search = """
    // Insert property
    const result = await query(
      `INSERT INTO properties (
        title, slug, location, price, type, status, description, image,
        category, district, city, locationLabel, priceLabel, bedrooms, bathrooms,
        isFeatured, isSoldOut, videoUrl, hotlineNumber, sortOrder,
        shortDescription, fullDescription, amenities, locationHighlights, floorPlans, brochureFiles
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, location, price, type, status || 'Active', description, mainImageUrl,
        category, district, city, locationLabel, priceLabel, bedrooms || null, bathrooms || null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        videoUrl, hotlineNumber, sortOrder || 0,
        shortDescription, fullDescription, amenitiesStr, locationHighlightsStr, floorPlansStr, brochureFilesStr
      ]
    );
"""
    sql_insert_replace = """
    // Insert property
    const result = await query(
      `INSERT INTO properties (
        title, slug, location, price, type, status, description, image,
        category, district, city, locationLabel, priceLabel, bedrooms, bathrooms,
        isFeatured, isSoldOut, videoUrl, hotlineNumber, sortOrder,
        shortDescription, fullDescription, amenities, locationHighlights, floorPlans, brochureFiles,
        logoImage, blockPlanImage, roadMapImage, locationMapImage, projectStatusLabel, travelHighlights, inquiryEmail, relatedLands, metaTitle, metaDescription, ogImage, whatsappNumber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, location, price, type, status || 'Active', description, mainImageUrl,
        category, district, city, locationLabel, priceLabel, bedrooms || null, bathrooms || null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        videoUrl, hotlineNumber, sortOrder || 0,
        shortDescription, fullDescription, amenitiesStr, locationHighlightsStr, floorPlansStr, brochureFilesStr,
        logoImageUrl, blockPlanImageUrl, roadMapImageUrl, locationMapImageUrl, projectStatusLabel, travelHighlightsStr, inquiryEmail, relatedLandsStr, metaTitle, metaDescription, ogImage, whatsappNumber
      ]
    );
"""
    content = content.replace(sql_insert_search, sql_insert_replace)


    # PUT /api/properties/:id block
    put_search = """
// PUT update property
app.put('/api/properties/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
"""
    put_replace = """
// PUT update property
app.put('/api/properties/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'blockPlanImage', maxCount: 1 },
    { name: 'roadMapImage', maxCount: 1 },
    { name: 'locationMapImage', maxCount: 1 },
    { name: 'brochureFile', maxCount: 1 }
]), async (req, res) => {
"""
    content = content.replace(put_search, put_replace)

    put_upload_search = """
    let mainImageUrl = existing[0].image;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
"""
    put_upload_replace = """
    let mainImageUrl = existing[0].image;
    if (req.files['image']) {
      mainImageUrl = `/uploads/${req.files['image'][0].filename}`;
    }
    let logoImageUrl = existing[0].logoImage;
    if (req.files['logoImage']) {
      logoImageUrl = `/uploads/${req.files['logoImage'][0].filename}`;
    }
    let blockPlanImageUrl = existing[0].blockPlanImage;
    if (req.files['blockPlanImage']) {
      blockPlanImageUrl = `/uploads/${req.files['blockPlanImage'][0].filename}`;
    }
    let roadMapImageUrl = existing[0].roadMapImage;
    if (req.files['roadMapImage']) {
      roadMapImageUrl = `/uploads/${req.files['roadMapImage'][0].filename}`;
    }
    let locationMapImageUrl = existing[0].locationMapImage;
    if (req.files['locationMapImage']) {
      locationMapImageUrl = `/uploads/${req.files['locationMapImage'][0].filename}`;
    }
"""
    content = content.replace(put_upload_search, put_upload_replace)

    sql_update_search = """
    await query(
      `UPDATE properties SET
        title = ?, slug = ?, location = ?, price = ?, type = ?, status = ?, description = ?, image = ?,
        category = ?, district = ?, city = ?, locationLabel = ?, priceLabel = ?, bedrooms = ?, bathrooms = ?,
        isFeatured = ?, isSoldOut = ?, videoUrl = ?, hotlineNumber = ?, sortOrder = ?,
        shortDescription = ?, fullDescription = ?, amenities = ?, locationHighlights = ?, floorPlans = ?, brochureFiles = ?
      WHERE id = ?`,
      [
        title, slug, location, price, type, status, description, mainImageUrl,
        category, district, city, locationLabel, priceLabel, bedrooms || null, bathrooms || null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        videoUrl, hotlineNumber, sortOrder || 0,
        shortDescription, fullDescription, amenitiesStr, locationHighlightsStr, floorPlansStr, brochureFilesStr,
        id
      ]
    );
"""
    sql_update_replace = """
    await query(
      `UPDATE properties SET
        title = ?, slug = ?, location = ?, price = ?, type = ?, status = ?, description = ?, image = ?,
        category = ?, district = ?, city = ?, locationLabel = ?, priceLabel = ?, bedrooms = ?, bathrooms = ?,
        isFeatured = ?, isSoldOut = ?, videoUrl = ?, hotlineNumber = ?, sortOrder = ?,
        shortDescription = ?, fullDescription = ?, amenities = ?, locationHighlights = ?, floorPlans = ?, brochureFiles = ?,
        logoImage = ?, blockPlanImage = ?, roadMapImage = ?, locationMapImage = ?, projectStatusLabel = ?, travelHighlights = ?, inquiryEmail = ?, relatedLands = ?, metaTitle = ?, metaDescription = ?, ogImage = ?, whatsappNumber = ?
      WHERE id = ?`,
      [
        title, slug, location, price, type, status, description, mainImageUrl,
        category, district, city, locationLabel, priceLabel, bedrooms || null, bathrooms || null,
        isFeatured === 'true' || isFeatured === true ? 1 : 0,
        isSoldOut === 'true' || isSoldOut === true ? 1 : 0,
        videoUrl, hotlineNumber, sortOrder || 0,
        shortDescription, fullDescription, amenitiesStr, locationHighlightsStr, floorPlansStr, brochureFilesStr,
        logoImageUrl, blockPlanImageUrl, roadMapImageUrl, locationMapImageUrl, projectStatusLabel, travelHighlightsStr, inquiryEmail, relatedLandsStr, metaTitle, metaDescription, ogImage, whatsappNumber,
        id
      ]
    );
"""
    content = content.replace(sql_update_search, sql_update_replace)

    # Make sure we also parse JSON correctly in GET
    get_json_search = """
    const parsedProperties = properties.map(p => ({
      ...p,
      amenities: safeParseJSON(p.amenities),
      locationHighlights: safeParseJSON(p.locationHighlights),
      floorPlans: safeParseJSON(p.floorPlans),
      brochureFiles: safeParseJSON(p.brochureFiles),
      isFeatured: !!p.isFeatured,
      isSoldOut: !!p.isSoldOut,
    }));
"""
    get_json_replace = """
    const parsedProperties = properties.map(p => ({
      ...p,
      amenities: safeParseJSON(p.amenities),
      locationHighlights: safeParseJSON(p.locationHighlights),
      floorPlans: safeParseJSON(p.floorPlans),
      brochureFiles: safeParseJSON(p.brochureFiles),
      travelHighlights: safeParseJSON(p.travelHighlights),
      relatedLands: safeParseJSON(p.relatedLands),
      isFeatured: !!p.isFeatured,
      isSoldOut: !!p.isSoldOut,
    }));
"""
    content = content.replace(get_json_search, get_json_replace)

    get_id_json_search = """
    property.amenities = safeParseJSON(property.amenities);
    property.locationHighlights = safeParseJSON(property.locationHighlights);
    property.floorPlans = safeParseJSON(property.floorPlans);
    property.brochureFiles = safeParseJSON(property.brochureFiles);
    property.isFeatured = !!property.isFeatured;
    property.isSoldOut = !!property.isSoldOut;
"""
    get_id_json_replace = """
    property.amenities = safeParseJSON(property.amenities);
    property.locationHighlights = safeParseJSON(property.locationHighlights);
    property.floorPlans = safeParseJSON(property.floorPlans);
    property.brochureFiles = safeParseJSON(property.brochureFiles);
    property.travelHighlights = safeParseJSON(property.travelHighlights);
    property.relatedLands = safeParseJSON(property.relatedLands);
    property.isFeatured = !!property.isFeatured;
    property.isSoldOut = !!property.isSoldOut;
"""
    content = content.replace(get_id_json_search, get_id_json_replace)

    with open('server.js', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_server()
