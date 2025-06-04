import React, { useState } from "react";
// import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  Sparkles,
  X,
} from "lucide-react";
import { addDays, startOfWeek, format, getDay, getDaysInMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  day: number;
  date: string; // format YYYY-MM-DD
  description: string;
  location: string;
  attendees: string[];
  organizer: string;
  type?: string;
}

// Sample calendar events
const events = [
  {
    id: 1,
    title: "Team Meeting",
    startTime: "09:00",
    endTime: "10:00",
    color: "bg-blue-500",
    day: 1,
    description: "Weekly team sync-up",
    location: "Conference Room A",
    attendees: ["John Doe", "Jane Smith", "Bob Johnson"],
    organizer: "Alice Brown",
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    startTime: "12:30",
    endTime: "13:30",
    color: "bg-green-500",
    day: 1,
    description: "Discuss project timeline",
    location: "Cafe Nero",
    attendees: ["Sarah Lee"],
    organizer: "You",
  },
  {
    id: 3,
    title: "Project Review",
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-purple-500",
    day: 3,
    description: "Q2 project progress review",
    location: "Meeting Room 3",
    attendees: ["Team Alpha", "Stakeholders"],
    organizer: "Project Manager",
  },
  {
    id: 4,
    title: "Client Call",
    startTime: "10:00",
    endTime: "11:00",
    color: "bg-yellow-500",
    day: 2,
    description: "Quarterly review with major client",
    location: "Zoom Meeting",
    attendees: ["Client Team", "Sales Team"],
    organizer: "Account Manager",
  },
  {
    id: 5,
    title: "Team Brainstorm",
    startTime: "13:00",
    endTime: "14:30",
    color: "bg-indigo-500",
    day: 4,
    description: "Ideation session for new product features",
    location: "Creative Space",
    attendees: ["Product Team", "Design Team"],
    organizer: "Product Owner",
  },
  {
    id: 6,
    title: "Product Demo",
    startTime: "11:00",
    endTime: "12:00",
    color: "bg-pink-500",
    day: 5,
    description: "Showcase new features to stakeholders",
    location: "Demo Room",
    attendees: ["Stakeholders", "Dev Team"],
    organizer: "Tech Lead",
  },
  {
    id: 7,
    title: "Marketing Meeting",
    startTime: "13:00",
    endTime: "14:00",
    color: "bg-teal-500",
    day: 6,
    description: "Discuss Q3 marketing strategy",
    location: "Marketing Office",
    attendees: ["Marketing Team"],
    organizer: "Marketing Director",
  },
  {
    id: 8,
    title: "Code Review",
    startTime: "15:00",
    endTime: "16:00",
    color: "bg-cyan-500",
    day: 7,
    description: "Review pull requests for new feature",
    location: "Dev Area",
    attendees: ["Dev Team"],
    organizer: "Senior Developer",
  },
  {
    id: 9,
    title: "Morning Standup",
    startTime: "08:30",
    endTime: "09:30",
    color: "bg-blue-400",
    day: 2,
    description: "Daily team standup",
    location: "Slack Huddle",
    attendees: ["Development Team"],
    organizer: "Scrum Master",
  },
  {
    id: 10,
    title: "Design Review",
    startTime: "14:30",
    endTime: "15:45",
    color: "bg-purple-400",
    day: 5,
    description: "Review new UI designs",
    location: "Design Lab",
    attendees: ["UX Team", "Product Manager"],
    organizer: "Lead Designer",
  },
  {
    id: 11,
    title: "Investor Meeting",
    startTime: "10:30",
    endTime: "12:00",
    color: "bg-red-400",
    day: 7,
    description: "Quarterly investor update",
    location: "Board Room",
    attendees: ["Executive Team", "Investors"],
    organizer: "CEO",
  },
  {
    id: 12,
    title: "Team Training",
    startTime: "09:30",
    endTime: "11:30",
    color: "bg-green-400",
    day: 4,
    description: "New tool onboarding session",
    location: "Training Room",
    attendees: ["All Departments"],
    organizer: "HR",
  },
  {
    id: 13,
    title: "Budget Review",
    startTime: "13:30",
    endTime: "15:00",
    color: "bg-yellow-400",
    day: 3,
    description: "Quarterly budget analysis",
    location: "Finance Office",
    attendees: ["Finance Team", "Department Heads"],
    organizer: "CFO",
  },
  {
    id: 14,
    title: "Client Presentation",
    startTime: "11:00",
    endTime: "12:30",
    color: "bg-orange-400",
    day: 6,
    description: "Present new project proposal",
    location: "Client Office",
    attendees: ["Sales Team", "Client Representatives"],
    organizer: "Account Executive",
  },
  {
    id: 15,
    title: "Product Planning",
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-pink-400",
    day: 1,
    description: "Roadmap discussion for Q3",
    location: "Strategy Room",
    attendees: ["Product Team", "Engineering Leads"],
    organizer: "Product Manager",
  },
  {
    id: 16,
    title: "🏠 Télétravail",
    startTime: "08:00",
    endTime: "17:00",
    color: "bg-green-600",
    day: 2,
    description: "Journée de télétravail",
    location: "Domicile",
    attendees: [],
    organizer: "Système",
    type: "status",
  },
  {
    id: 17,
    title: "🏢 Présentiel",
    startTime: "08:00",
    endTime: "17:00",
    color: "bg-blue-600",
    day: 3,
    description: "Journée au bureau",
    location: "Bureau",
    attendees: [],
    organizer: "Système",
    type: "status",
  },
  {
    id: 18,
    title: "✈️ Congé",
    startTime: "08:00",
    endTime: "17:00",
    color: "bg-purple-600",
    day: 6,
    description: "Jour de congé",
    location: "Congé",
    attendees: [],
    organizer: "Système",
    type: "status",
  },
];

// Sample calendar days for the week view
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const weekDates = [3, 4, 5, 6, 7, 8, 9];
const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8); // 8 AM to 4 PM

// Helper function to calculate event position and height
const calculateEventStyle = (startTime, endTime) => {
  const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60;
  const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60;
  const top = (start - 8) * 80; // 80px per hour
  const height = (end - start) * 80;
  return { top: `${top}px`, height: `${height}px` };
};

// Sample calendar for mini calendar
const daysInMonth = 31;
const firstDayOffset = 5; // Friday is the first day of the month in this example
const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
  i < firstDayOffset ? null : i - firstDayOffset + 1,
);

// Sample my calendars
const myCalendars = [
  { name: "My Calendar", color: "bg-blue-500" },
  { name: "Work", color: "bg-green-500" },
];

// Pour les labels français
const joursCourts = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const moisFrancais = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];
const horaires = [
  '8H', '9H', '10H', '11H', '12H', '13H', '14H', '15H', '16H'
];

interface CalendarViewProps {
  onClose?: () => void;
}

export default function CalendarView({ onClose }: CalendarViewProps) {
  // State pour Planning Event (agenda central)
  const [eventSelectedDate, setEventSelectedDate] = useState(new Date(2025, 2, 5));
  const [eventCurrentMonth, setEventCurrentMonth] = useState(2);
  const [eventCurrentYear, setEventCurrentYear] = useState(2025);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Calcul de la semaine affichée
  const weekStart = startOfWeek(eventSelectedDate, { weekStartsOn: 0 }); // dimanche
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Navigation semaine
  const goToPrevWeek = () => setEventSelectedDate(addDays(eventSelectedDate, -7));
  const goToNextWeek = () => setEventSelectedDate(addDays(eventSelectedDate, 7));
  const goToToday = () => setEventSelectedDate(new Date(eventCurrentYear, eventCurrentMonth, new Date().getDate()));

  // Mini-calendrier navigation
  const goToPrevMonth = () => {
    if (eventCurrentMonth === 0) {
      setEventCurrentMonth(11);
      setEventCurrentYear(eventCurrentYear - 1);
    } else {
      setEventCurrentMonth(eventCurrentMonth - 1);
    }
    setEventSelectedDate(new Date(eventCurrentYear, eventCurrentMonth === 0 ? 11 : eventCurrentMonth - 1, 1));
  };
  const goToNextMonth = () => {
    if (eventCurrentMonth === 11) {
      setEventCurrentMonth(0);
      setEventCurrentYear(eventCurrentYear + 1);
    } else {
      setEventCurrentMonth(eventCurrentMonth + 1);
    }
    setEventSelectedDate(new Date(eventCurrentYear, eventCurrentMonth === 11 ? 0 : eventCurrentMonth + 1, 1));
  };

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  // Remettre le state pour la présence
  const [presenceWeek, setPresenceWeek] = useState<{ [date: string]: 'remote' | 'presentiel' | null }>({});

  // Remettre la fonction de toggle cyclique
  const handleTogglePresenceCentral = (date: Date) => {
    const key = date.toISOString().slice(0, 10);
    setPresenceWeek((prev) => {
      const current = prev[key];
      let next: 'remote' | 'presentiel' | null = null;
      if (current === null || current === undefined) next = 'remote';
      else if (current === 'remote') next = 'presentiel';
      else if (current === 'presentiel') next = null;
      return { ...prev, [key]: next };
    });
  };

  // 1. State pour afficher la modale
  const [showCreateModal, setShowCreateModal] = useState(false);
  // 2. State pour le formulaire
  const [form, setForm] = useState({
    title: '',
    date: eventSelectedDate.toISOString().slice(0, 10),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    color: 'bg-blue-500',
    calendar: 'My Calendar',
  });

  // 1. State pour afficher ou masquer la liste des events dans la sidebar
  const [showEventsList, setShowEventsList] = useState(false);

  // State pour la réponse de l'utilisateur par eventId
  const [userEventResponses, setUserEventResponses] = useState<{ [eventId: number]: 'yes' | 'maybe' | 'no' }>({});

  // Fonction utilitaire pour exporter une liste en CSV
  const exportListCSV = (list, filename = 'participants.csv') => {
    const csv = list.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[1000] min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-200 via-green-300 to-green-400">
      {/* Close button */}
      {onClose && (
        <button
          className="fixed top-6 right-8 z-[1100] bg-white/80 hover:bg-white text-green-700 rounded-full p-2 shadow-lg transition"
          onClick={onClose}
          aria-label="Fermer le calendrier"
        >
          <span style={{fontSize:24, fontWeight:'bold'}}>&times;</span>
        </button>
      )}
      {/* Navigation */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-white" />
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
          U
        </div>
      </header>
      {/* Main Content */}
      <main className="relative h-screen w-full pt-20 flex">
        {/* Sidebar */}
        <div className="w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl flex flex-col justify-between">
          <div className="flex flex-col h-full">
            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <div>
                {/* 3. Ouvrir la modale au clic sur le bouton Create */}
                <button className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-5 w-5" />
                  <span>Create</span>
                </button>
                {/* Mini Calendar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{moisFrancais[eventCurrentMonth]} {eventCurrentYear}</h3>
                    <div className="flex gap-1">
                      <button className="p-1 rounded-full hover:bg-white/20" onClick={goToPrevMonth}>
                        <ChevronLeft className="h-4 w-4 text-white" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-white/20" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {joursCourts.map((day, i) => (
                      <div key={i} className="text-xs text-white/70 font-medium py-1">{day}</div>
                    ))}
                    {miniCalendarDays.map((day, i) => (
                      <div
                        key={i}
                        className={`text-xs rounded-full w-7 h-7 flex items-center justify-center cursor-pointer ${
                          day && eventSelectedDate.getDate() === day && eventSelectedDate.getMonth() === eventCurrentMonth ? "bg-blue-500 text-white" : "text-white hover:bg-white/20"
                        } ${!day ? "invisible" : ""}`}
                        onClick={() => { if (day) setEventSelectedDate(new Date(eventCurrentYear, eventCurrentMonth, day)); }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <button
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white font-semibold mb-2"
                    onClick={() => setShowEventsList((v) => !v)}
                  >
                    <Calendar className="h-5 w-5" />
                    Events
                  </button>
                  {showEventsList && (
                    <div className="bg-white/30 rounded-lg p-2 max-h-64 overflow-y-auto">
                      {events.length === 0 ? (
                        <div className="text-white/70 text-sm text-center">Aucun événement</div>
                      ) : (
                        events
                          .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime())
                          .map((event) => (
                            <div
                              key={event.id}
                              className="mb-2 p-2 rounded hover:bg-green-100/60 cursor-pointer transition"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="font-semibold text-green-900">{event.title}</div>
                              <div className="text-xs text-green-800">{format(new Date(event.date), 'd MMM yyyy', { locale: fr })} • {event.startTime} - {event.endTime}</div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Calendar View */}
        <div className="flex-1 flex flex-col">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={goToToday}>Aujourd'hui</button>
              <div className="flex">
                <button className="p-2 text-white hover:bg-white/10 rounded-l-md" onClick={goToPrevWeek}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded-r-md" onClick={goToNextWeek}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">Semaine du {format(weekStart, 'd MMM yyyy', { locale: fr })}</h2>
            </div>
            {/* Légende explicative à droite */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 text-white text-xs">
              <span>Cliquez sur les pastilles sous chaque jour pour indiquer votre présence :</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Présentiel</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Remote</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-gray-300"></span> Aucun</span>
            </div>
          </div>
          {/* Week View */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
              {/* Week Header */}
              <div className="grid grid-cols-8 border-b border-white/20">
                <div className="p-2 text-center text-white/50 text-xs"></div>
                {weekDays.map((date, i) => {
                  const key = date.toISOString().slice(0, 10);
                  const state = presenceWeek[key];
                  return (
                    <div key={i} className="p-2 text-center border-l border-white/20 flex flex-col items-center">
                      <div className="text-xs text-white/70 font-medium">{joursCourts[date.getDay()]}</div>
                      <div className={`text-lg font-medium mt-1 text-white ${date.getDate() === eventSelectedDate.getDate() && date.getMonth() === eventCurrentMonth ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>{date.getDate()}</div>
                      {/* Pastille d'état, toggle cyclique au clic */}
                      <span
                        className={`inline-block w-5 h-5 rounded-full mt-2 cursor-pointer ${state === 'remote' ? 'bg-blue-500' : state === 'presentiel' ? 'bg-green-500' : 'bg-gray-300'}`}
                        title={state === 'remote' ? 'Remote' : state === 'presentiel' ? 'Présentiel' : 'Aucun'}
                        onClick={() => handleTogglePresenceCentral(date)}
                      ></span>
                    </div>
                  );
                })}
              </div>
              {/* Time Grid */}
              <div className="grid grid-cols-8">
                {/* Time Labels */}
                <div className="text-white/70">
                  {horaires.map((h, i) => (
                    <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs">{h}</div>
                  ))}
                </div>
                {/* Days Columns */}
                {weekDays.map((date, dayIndex) => (
                  <div key={dayIndex} className="border-l border-white/20 relative">
                    {Array.from({ length: 9 }).map((_, timeIndex) => (
                      <div key={timeIndex} className="h-20 border-b border-white/10"></div>
                    ))}
                    {/* Events */}
                    {events
                      .filter((event) => {
                        const eventDate = new Date(event.date);
                        return (
                          eventDate.getFullYear() === date.getFullYear() &&
                          eventDate.getMonth() === date.getMonth() &&
                          eventDate.getDate() === date.getDate()
                        );
                      })
                      .map((event, i) => {
                        const eventStyle = calculateEventStyle(event.startTime, event.endTime);
                        return (
                          <div
                            key={i}
                            className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                            style={{
                              ...eventStyle,
                              left: "4px",
                              right: "4px",
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Modal détail événement */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {format(new Date(selectedEvent.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>Participants :</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "Aucun participant"}
                  </span>
                </p>
                <p>
                  <strong>Organisateur :</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Description :</strong> {selectedEvent.description}
                </p>
                <div className="flex gap-2 mt-4">
                  {['yes', 'maybe', 'no'].map((resp) => (
                    <button
                      key={resp}
                      className={`px-4 py-2 rounded font-semibold text-sm transition border-2 ${
                        userEventResponses[selectedEvent.id] === resp
                          ? resp === 'yes'
                            ? 'bg-green-500 text-white border-green-600'
                            : resp === 'maybe'
                            ? 'bg-yellow-400 text-white border-yellow-500'
                            : 'bg-red-500 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setUserEventResponses((prev) => ({ ...prev, [selectedEvent.id]: resp as 'yes' | 'maybe' | 'no' }));
                        setEvents((prev) => prev.map(ev => {
                          if (ev.id !== selectedEvent.id) return ev;
                          let attendees = ev.attendees.filter(name => name !== 'Moi');
                          if (resp === 'yes') attendees = [...attendees, 'Moi'];
                          return { ...ev, attendees };
                        }));
                      }}
                    >
                      {resp === 'yes' ? 'Je participe' : resp === 'maybe' ? 'Je ne sais pas' : 'Je ne participe pas'}
                    </button>
                  ))}
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-white text-green-700 rounded shadow hover:bg-green-100 text-sm"
                  onClick={() => exportListCSV(selectedEvent.attendees, `participants-${selectedEvent.title}.csv`)}
                >
                  Exporter la liste des présents
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 4. Modale de création d'événement */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[2000]">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-green-700">Créer un événement</h2>
              <form onSubmit={e => {
                e.preventDefault();
                setEvents(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    title: form.title,
                    startTime: form.startTime,
                    endTime: form.endTime,
                    color: 'bg-blue-500',
                    day: new Date(form.date).getDay(),
                    date: form.date,
                    description: form.description,
                    location: form.location,
                    attendees: [],
                    organizer: 'Moi',
                  }
                ]);
                setShowCreateModal(false);
                setForm({
                  title: '',
                  date: eventSelectedDate.toISOString().slice(0, 10),
                  startTime: '09:00',
                  endTime: '10:00',
                  location: '',
                  description: '',
                  color: 'bg-blue-500',
                  calendar: 'My Calendar',
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input required className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                    <input type="time" className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.startTime} onChange={e => setForm(f => ({...f, startTime: e.target.value}))} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                    <input type="time" className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.endTime} onChange={e => setForm(f => ({...f, endTime: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full rounded-md border border-gray-300 px-3 py-2" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={() => setShowCreateModal(false)}>Annuler</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">Créer</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 