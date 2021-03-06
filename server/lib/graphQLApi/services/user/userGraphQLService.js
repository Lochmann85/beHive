import findAllUsersTemplate from './findAllUsers';
import findUserTemplate from './findUser';
import createUserTemplate from './createUser';
import updateUserTemplate from './updateUser';
import deleteUserTemplate from './deleteUser';
import changeUserPasswordTemplate from './changeUserPassword';
import loginTemplate from './login';
import checkViewerTemplate from './checkViewer';

const types = `
type User {
   id: ID!
   email: String!
   name: String!
   isDeletable: Boolean!
   createdAt: String!
   updatedAt: String!
}
type Viewer {
   id: ID!
   name: String!
   token: String!
}
input UserData {
   email: String
   name: String
   password: String
}
input PasswordChangeData {
   password: String
   new: String
   confirm: String
}
input Credentials {
   email: String
   password: String
}
`;

const queries = `
   checkViewer: Viewer
   findAllUsers: [User!]
   findUser(userId: ID): User!
`;

const queriesResolver = (userDbService) => ({
   checkViewer: checkViewerTemplate(userDbService),
   findAllUsers: findAllUsersTemplate(userDbService),
   findUser: findUserTemplate(userDbService),
});

const mutations = `
   createUser(userData: UserData): User!
   updateUser(userId: ID, userData:  UserData): User!
   deleteUser(userId: ID): User!
   changeUserPassword(userId: ID, passwordChangeData: PasswordChangeData): Boolean!
   login(credentials: Credentials): Viewer!
`;

const mutationsResolver = (userDbService) => ({
   createUser: createUserTemplate(userDbService),
   updateUser: updateUserTemplate(userDbService),
   deleteUser: deleteUserTemplate(userDbService),
   changeUserPassword: changeUserPasswordTemplate(userDbService),
   login: loginTemplate(userDbService),
});

/**
 * @public
 * @function create
 * @description user graphQL service factory
 * @param {object} database - the database wrapper
 * @returns {Promise} of graphQL user service
 */
const create = (
   database,
) => {
   const {
      services: {
         userDbService
      }
   } = database;

   return Object.freeze({
      types,
      queries,
      queriesResolver: queriesResolver(userDbService),
      mutations,
      mutationsResolver: mutationsResolver(userDbService),
   });
};

const noAuthRequest = [
   "login",
   "checkViewer",
];

export {
   create,
   noAuthRequest
};