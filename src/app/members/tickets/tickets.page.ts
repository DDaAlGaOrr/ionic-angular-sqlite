import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list'

import { NetworkService } from '../../services/network.service';
import { TicketsService } from '../../services/tickets.service';
import { TicketEvent } from '../../interfaces/Projects';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  subsidiaryId: string = ''
  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, listPlugin],
    initialView: 'listMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'listMonth'
    },
    eventClick: this.getTicket.bind(this),
    events: []
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private ticketsService: TicketsService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subsidiaryId = params['subsidiaryId'];
    })
    const tickets = await this.getTickets(this.subsidiaryId)
    this.calendarOptions.events = tickets
  }

  getTicket(event: any) {
    this.router.navigate(['/members', 'ticket'], {
      queryParams: {
        ticketId: event.event.id,
      },
    });
  }

  async getTickets(subsidiaryId: string) {
    if (this.networkService.getNetworkStatus()) {
      return await this.getTicketsOnline(subsidiaryId)
    } else {
      this.getTicketsOffline(subsidiaryId)
    }
  }

  async getTicketsOnline(subsidiaryId: string) {
    const data = await this.ticketsService.HaveIncidents(subsidiaryId)
    let ticketsEvents = [];
    ticketsEvents = data.map((event: any) => {
      const localDate = new Date(event.start_date);
      localDate.setDate(localDate.getDate() + 1);
      return {
        start: localDate,
        end: localDate,
        title: event.description,
        id: event.ticketid,
      };
    });
    return ticketsEvents
  }

  getTicketsOffline(subsidiaryId: string) { }

}
