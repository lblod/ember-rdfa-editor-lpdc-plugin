import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';

export default class LpdcPublicServiceModalComponent extends Component {
  @tracked serviceFilter;
  @tracked showTable = true;
  @tracked selectedService;
  @tracked cost;
  @tracked from;
  @tracked to;

  services;
  constructor() {
    super(...arguments);
    const config = getOwner(this).resolveRegistration('config:environment');
    this.services = config.publicServices;
  }

  setFilter(filter) {
    this.serviceFilter = filter;
  }

  get filteredServices() {
    // TODO use filter
    return this.services;
  }

  @action
  extend(service) {
    this.selectedService = service;
    this.showTable = false;
  }

  @action
  changeFromDate(isoDate, date) {
    this.from = date;
  }

  @action
  changeToDate(isoDate, date) {
    this.to = date;
  }

  @action
  insert() {
    console.log(this.selectedService);
    console.log(this.cost);
    console.log(this.from);
    console.log(this.to);
  }
}
