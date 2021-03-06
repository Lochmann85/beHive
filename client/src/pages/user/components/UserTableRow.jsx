import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import moment from 'moment';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { List, Button } from 'semantic-ui-react';

import { BeHiveButton } from '../../../assets/styles/UI';
import AccordionItemHeader from '../../../components/table/AccordionItemHeader';
import AccordionItemContent from '../../../components/table/AccordionItemContent';

const cellPadding = css`
   padding: .78571429em
`;

const EMailCell = styled.div`
   ${cellPadding};
   width: 37.5%;
   text-align: left;
   @media only screen and (max-width: 991px) {
      width: auto;
      flex: 1 1 auto;
   };
`;

const NameCell = styled.div`
   ${cellPadding};
   width: 31.25%;
   text-align: left;
   @media only screen and (max-width: 991px) {
      display: none;
   };
`;

const CreatedAtCell = styled.div`
   ${cellPadding};
   text-align: left;
   flex: 1 1 auto;
   @media only screen and (max-width: 991px) {
      display: none;
   };
`;

const RemainingValueList = styled(List)`
   margin-left: 2rem!important;
   & > div {
      padding: 0 .78571429em .78571429em .78571429em!important;
   };
   @media only screen and (min-width: 992px) {
      display: none;
   };
`;

const StyledAccordionItem = styled.div`
   i.icon.dropdown {
      width: 40px!important;
   };
`;

const UserTableRow = (props) => {
   const {
      user,
      index,
      activeIndex,
      onRowClick,
      relatedPaths,
      onDeleteClick,
      viewer,
   } = props;

   let createdAt = new Date(user.createdAt);
   createdAt = moment(createdAt).format("DD.MM.YYYY - HH:mm");

   let deleteButton;
   if (user.isDeletable && user.id !== viewer.id) {
      deleteButton = <Button color="red" content="Delete" onClick={() => onDeleteClick(user.id)} />;
   }

   return (
      <StyledAccordionItem>
         <AccordionItemHeader
            index={index}
            activeIndex={activeIndex}
            onClick={onRowClick}>
            <EMailCell>{user.email}</EMailCell>
            <NameCell>{user.name}</NameCell>
            <CreatedAtCell>{createdAt}</CreatedAtCell>
         </AccordionItemHeader>
         <AccordionItemContent
            index={index}
            activeIndex={activeIndex}
            interactionButtons={
               <React.Fragment>
                  <Link to={`${relatedPaths.updateUser}/${user.id}`} >
                     <BeHiveButton content="Edit" />
                  </Link>
                  {deleteButton}
               </React.Fragment>
            } >
            <RemainingValueList bulleted>
               <List.Item content={`Name: ${user.name}`} />
               <List.Item content={`Created at: ${createdAt}`} />
            </RemainingValueList>
         </AccordionItemContent>
      </StyledAccordionItem >
   );
};

UserTableRow.header = [
   { width: 6, label: "E-Mail" },
   { width: 5, label: "Name" },
   { width: 5, label: "Created at" }
];

const userFragment = {
   name: "UserTableRow",
   document: gql`
   fragment UserTableRow on User {
      id
      email
      name
      isDeletable
      createdAt
   }`
};

const viewerFragment = {
   name: "UserTableRowViewer",
   document: gql`
   fragment UserTableRowViewer on Viewer {
      id
   }`
};


UserTableRow.propTypes = {
   onDeleteClick: PropTypes.func.isRequired,
   user: propType(userFragment.document).isRequired,
   viewer: propType(viewerFragment.document),
   relatedPaths: PropTypes.shape({
      updateUser: PropTypes.string.isRequired,
   }).isRequired,
   activeIndex: PropTypes.number.isRequired,
   index: PropTypes.number.isRequired,
   onRowClick: PropTypes.func.isRequired,
};

UserTableRow.fragments = {
   user: userFragment,
   viewer: viewerFragment,
};

export default UserTableRow;