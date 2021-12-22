import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';

export default class LpdcPublicServiceModalComponent extends Component {
  @tracked serviceFilter;
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
}
