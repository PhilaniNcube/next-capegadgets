import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema(
  {
    contents: { type: Array },
    contributors: { type: Array },
    copy_restrictions: { type: Number },
    copyright_date: { type: String },
    description: { type: String },
    edition: { type: Number },
    exclude_sales_rights: { type: Array },
    format: { type: String },
    identifiers: { type: Object },
    imprint_name: { type: String },
    kind: { type: String },
    language: { type: String },
    off_sale_date: { type: String },
    page_count: { type: Number },
    parent_isbn: { type: String },
    print_restrictions: { type: Number },
    publication_date: { type: String },
    publisher: { type: String },
    publisher_list_price: { type: String },
    related_products: { type: Object },
    resource_links: { type: Object },
    sales_rights: { type: Array },
    sort_title: { type: String },
    subjects: { type: Array },
    subtitle: { type: String },
    title: { type: String },
    variants: { type: Array },
    vbid: { type: String },
  },
  {
    timestamps: true,
  },
);

const Ebook = mongoose.models.Ebook || mongoose.model('Ebook', ebookSchema);

export default Ebook;
