/**
 * FaceRecognitionService — Architecture stub for future AI integration.
 *
 * When ready to implement, integrate with one of:
 *   - AWS Rekognition (https://aws.amazon.com/rekognition/)
 *   - Google Cloud Vision (https://cloud.google.com/vision)
 *   - Azure Face API (https://azure.microsoft.com/en-us/products/ai-services/ai-face)
 *   - DeepFace (open source Python service)
 *
 * The service should:
 * 1. Index faces when photos are uploaded (store face vectors in a DB/vector store)
 * 2. Accept a selfie, extract face embeddings
 * 3. Find matching faces across all indexed photos for the event
 *
 * This file provides the interface contract so the rest of the codebase
 * can call these methods without knowing the implementation details.
 */
class FaceRecognitionService {
  /**
   * Index a face from an uploaded photo.
   * Called automatically when a photo is uploaded to an event.
   *
   * @param {string} photoUrl - URL of the photo
   * @param {string} photoId - MongoDB Photo document ID
   * @param {string} eventId - MongoDB Event document ID
   * @returns {Promise<void>}
   */
  async indexFace(photoUrl, photoId, eventId) {
    // TODO: Integrate face recognition API
    // Example with AWS Rekognition:
    // const rekognition = new AWS.Rekognition();
    // await rekognition.indexFaces({ CollectionId: eventId, Image: { Url: photoUrl } }).promise();
    throw new Error('Face recognition not yet implemented. Coming in Phase 3.');
  }

  /**
   * Search for matching photos using a selfie.
   * Returns an array of matching Photo document IDs.
   *
   * @param {string} selfieUrl - URL of the uploaded selfie
   * @param {string} eventId - Event to search within
   * @returns {Promise<string[]>} - Array of matching photo IDs
   */
  async searchByFace(selfieUrl, eventId) {
    // TODO: Integrate face recognition API
    throw new Error('Face recognition not yet implemented. Coming in Phase 3.');
  }

  /**
   * Remove all indexed faces for an event (when event is deleted).
   * @param {string} eventId
   */
  async deleteEventIndex(eventId) {
    // TODO: Clean up face collection
    throw new Error('Face recognition not yet implemented. Coming in Phase 3.');
  }
}

export default new FaceRecognitionService();
