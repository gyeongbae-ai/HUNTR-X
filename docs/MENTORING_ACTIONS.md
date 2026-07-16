# Mentoring action notes

## Product direction

- Treat personas by processing path, not by department label. Keep the current four examples as demo data, but judge coverage by whether each case exercises a different rule path: single major, secondary/convergence requirements, early graduation, and evidence review.
- Optimize the happy path first: sign up, set profile, upload/choose evidence, review ambiguous fields, save, return to requirements, and ask one follow-up question.
- Phrase human review as a light verification step. Users should not feel they are re-entering everything; they are confirming important or uncertain fields after document parsing.

## Retrieval and accuracy

- Use metadata before text similarity. Admission year, department, degree type, secondary program, and document type should narrow the context before an answer is generated.
- Keep rule calculations in code and use the LLM for explanation, intent handling, and next-step wording.
- For freshness, refresh academic documents by academic-year cycle. Preserve unchanged rules and update only changed rules when documents conflict.

## Demo framing

- Show the document workflow: source document, structured extraction, user review, rule connection, and saved personalized result.
- Use one reliable happy-path scenario for the five-minute demo instead of trying to prove every persona.
- Present Solar as cost-effective for explanation/summarization, while Document Parse carries the structural parsing contribution.
