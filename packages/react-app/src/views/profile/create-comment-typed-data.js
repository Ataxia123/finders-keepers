// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql, useMutation } from "@apollo/client";

const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        profileIdPointed
        pubIdPointed
        referenceModuleData
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
     }
   }
 }
`;

export const CreateCommentTypedData = createCommentTypedDataRequest => {
  return useMutation(gql(CREATE_COMMENT_TYPED_DATA), {
    variables: {
      request: createCommentTypedDataRequest,
    },
  });
};
