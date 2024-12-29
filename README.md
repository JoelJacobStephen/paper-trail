# Paper Trail - AI-Powered Document Chat

Paper Trail is an intelligent document analysis tool that allows users to upload PDF documents and engage in contextual conversations about their content using advanced Language Learning Models (LLMs). Perfect for legal documents, research papers, or any text-heavy PDFs that require in-depth understanding.

## Features

- 📄 PDF document upload and processing
- 💬 Contextual chat interface with AI
- 🔒 Secure user authentication
- 💎 Pro subscription options
- 📱 Responsive design
- ☁️ Cloud storage integration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Drizzle ORM)
- **Authentication**: Clerk
- **File Storage**: AWS S3
- **Vector Database**: Pinecone
- **AI/LLM**: OpenAI
- **Payment Processing**: Stripe

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
DATABASE_URL=
NEXT_PUBLIC_S3_ACCESS_KEY_ID=
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=
NEXT_PUBLIC_S3_BUCKET_NAME=
NEXT_PUBLIC_S3_REGION=
OPENAI_API_KEY=
PINECONE_API_KEY=
STRIPE_API_KEY=
STRIPE_WEBHOOK_SIGNING_SECRET=
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How It Works

1. **Document Upload**: Users can upload PDF documents through the drag-and-drop interface (reference: `src/components/FileUpload.tsx`).

2. **Processing**: The system:

   - Uploads the document to S3
   - Processes the PDF content
   - Creates embeddings using OpenAI
   - Stores vectors in Pinecone for efficient retrieval

3. **Chat Interface**: Users can ask questions about their documents and receive contextual responses powered by AI (reference: `src/components/ChatComponent.tsx`).

## Project Structure

The project follows a standard Next.js 13+ structure with the app router:

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions and configurations
└── middleware.ts    # Authentication middleware
```

## Features in Detail

### Authentication

- Secure user authentication handled by Clerk
- Protected routes and API endpoints
- Reference: `src/middleware.ts`

### Document Processing

- S3 integration for document storage
- PDF parsing and text extraction
- Vector embeddings for semantic search
- Reference: `src/lib/pinecone.ts`

### Chat Interface

- Real-time chat with AI
- Context-aware responses
- Message history
- Reference: `src/components/ChatComponent.tsx`

### Subscription Management

- Pro tier features
- Stripe integration for payments
- Subscription status tracking
- Reference: `src/components/SubscriptionButton.tsx`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For more information about the core technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.dev/docs)
- [Pinecone Vector Database](https://www.pinecone.io/docs/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Stripe Payments](https://stripe.com/docs)
