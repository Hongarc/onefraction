import { MiddlewareFn } from 'type-graphql'
import { Model, Document } from 'mongoose'
import { getClassForDocument } from 'typegoose'

export const TypegooseMiddleware: MiddlewareFn = async (_, next) => {
  let result = await next()

  if (!Array.isArray(result)) {
    result = [result]
  }
  return result.map(item => (item instanceof Model ? convertDocument(item) : item))
}

function convertDocument(doc: Document) {
  const convertedDocument = doc.toObject()
  const DocumentClass: Function = getClassForDocument(doc)
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype)
  return convertedDocument
}
