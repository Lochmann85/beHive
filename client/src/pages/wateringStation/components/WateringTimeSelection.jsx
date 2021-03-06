import React from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import gql from 'graphql-tag';
import styled, { css } from 'styled-components';

import { Form, Icon, Table, Button } from 'semantic-ui-react';

import { BeHiveYellowHoverCss, BeHiveButton, TableAccordion } from '../../../assets/styles/UI';
import AccordionItemHeader from '../../../components/table/AccordionItemHeader';
import AccordionItemContent from '../../../components/table/AccordionItemContent';
import AddWateringTimeModal from './AddWateringTimeModal';
import checkForErrorInInput from '../../../helper/validation';

const interactionCellWidth = css`width: 79px`;

const StyledTable = styled(Table)`
   @media only screen and (min-width: 400px) {
      width:350px!important;
   }
   & th:last-child, td:last-child {
      ${interactionCellWidth};
      text-align:center!important;
   }
`;

const StyledTableCell = styled(Table.Cell)`
   padding: 0!important;
`;

const StyledAddHeaderCell = styled(Table.HeaderCell)`
   cursor: pointer!important;
   ${BeHiveYellowHoverCss}
`;

const cellPadding = css`padding: .78571429em`;

const TimeCell = styled.div`
   ${cellPadding};
   width: 31.25%;
   text-align: left;
`;

const DurationCell = styled.div`
   ${cellPadding};
   text-align: left;
   flex: 1 1 auto;
`;

const StyledAccordionItem = styled.div`
   i.icon.dropdown {
      ${interactionCellWidth}!important;
   };
`;

const ContentOffsetWrapper = styled.div`
   margin-bottom: 2rem;
`;

const wateringStationFragment = {
   name: "WateringTimeSelection",
   document: gql`
   fragment WateringTimeSelection on WateringStation {
      wateringTimes {
         id
         duration
         time
      }
   }`
};

class WateringTimeSelection extends React.Component {

   static fragments = {
      wateringStation: wateringStationFragment
   }

   static propTypes = {
      onChange: PropTypes.func.isRequired,
      wateringStation: propType(wateringStationFragment.document),
   }

   constructor(props) {
      super(props);

      this.state = {
         openAddWatering: false,
         selectedWatering: null,
         activeIndex: -1,
      };
   }

   render() {
      const {
         activeIndex
      } = this.state;

      const wateringTimes = this.props.wateringStation.wateringTimes;

      const errors = this.props.errors ? this.props.errors : [];
      const durationHasError = checkForErrorInInput("duration", errors);
      const timeHasError = checkForErrorInInput("time", errors);
      const wateringTimesHasError = durationHasError || timeHasError;

      let content;
      if (Array.isArray(wateringTimes) && wateringTimes.length > 0) {

         const wateringTimesTableBody = wateringTimes.map((watering, index) =>
            <StyledAccordionItem key={index}>
               <AccordionItemHeader
                  index={index}
                  activeIndex={activeIndex}
                  onClick={this._setSelectedWateringTime}>
                  <TimeCell>{watering.time}</TimeCell>
                  <DurationCell>{watering.duration}</DurationCell>
               </AccordionItemHeader>
               <AccordionItemContent
                  index={index}
                  activeIndex={activeIndex}
                  interactionButtons={
                     <React.Fragment>
                        <BeHiveButton content="Edit" onClick={() => this._handleWateringEdit(index)} />
                        <Button color="red" content="Delete" onClick={() => this._handleWateringDelete(index)} />
                     </React.Fragment>
                  }
               />
            </StyledAccordionItem>
         );

         content = (
            <StyledTable unstackable>
               <Table.Header>
                  <Table.Row>
                     <Table.HeaderCell content="Time" width={5} />
                     <Table.HeaderCell content="Duration" />
                     <StyledAddHeaderCell content={<Icon className="ficon-plus" />} onClick={this._openAddWatering} />
                  </Table.Row>
               </Table.Header>
               <Table.Body>
                  <Table.Row>
                     <StyledTableCell colSpan={3}>
                        <TableAccordion>
                           {wateringTimesTableBody}
                        </TableAccordion>
                     </StyledTableCell>
                  </Table.Row>
               </Table.Body>
            </StyledTable>
         );
      }
      else {
         content = <BeHiveButton content="Add watering time" onClick={this._openAddWatering} />;
      }

      return (
         <Form.Field
            error={wateringTimesHasError}>
            <label>Watering times</label>
            <ContentOffsetWrapper>
               {content}
            </ContentOffsetWrapper>
            <AddWateringTimeModal
               open={this.state.openAddWatering}
               watering={this.state.selectedWatering}
               onCloseClick={this._handleCloseAddWatering}
               onWateringTimeChange={this._handleWateringTimeChange} />
         </Form.Field>
      );
   };

   _setSelectedWateringTime = (event, wateringItem) => {
      const { index } = wateringItem;
      const { activeIndex } = this.state;

      if (index === activeIndex) {
         this.setState({ activeIndex: -1 });
      }
      else {
         const watering = this.props.wateringStation.wateringTimes[index];

         if (watering) {
            this.setState({ activeIndex: index });
         }
      }
   };

   _handleWateringDelete = (indexToDelete) => {
      const {
         onChange,
         wateringStation
      } = this.props;

      const wateringTimesCopy = wateringStation.wateringTimes.filter((entry, index) => index !== indexToDelete);

      this.setState({ activeIndex: -1 }, () => {
         onChange({}, { name: "wateringTimes", value: wateringTimesCopy });
      });
   };

   _handleWateringEdit = (indexToEdit) => {
      const watering = this.props.wateringStation.wateringTimes[indexToEdit];

      this.setState({
         openAddWatering: true,
         selectedWatering: Object.assign({ index: indexToEdit }, watering)
      });
   };

   _openAddWatering = () => this.setState({ openAddWatering: true, selectedWatering: null });

   _handleCloseAddWatering = () => this.setState({ openAddWatering: false, selectedWatering: null });

   _handleWateringTimeChange = (wateringTime) => {
      const {
         onChange,
         wateringStation
      } = this.props;
      const {
         selectedWatering
      } = this.state;

      let changeCallback = () => onChange({}, { name: "wateringTimes", value: [...wateringStation.wateringTimes, wateringTime] });

      if (selectedWatering) {
         const value = wateringStation.wateringTimes.map((watering, index) => {
            if (index === selectedWatering.index) {
               return wateringTime;
            }
            return watering;
         });

         changeCallback = () => onChange({}, { name: "wateringTimes", value });
      }

      this.setState({ openAddWatering: false, selectedWatering: null }, changeCallback);
   };
};

export default WateringTimeSelection;