import { Doctor } from "../types/health";

export const doctors: Doctor[] = [
  {
    id: "dr_smith_gp",
    name: "Dr. Sarah Smith",
    specialty: "General Practitioner",
    rating: 4.8,
    experience: 12,
    location: {
      address: "123 Main Street, Medical Center",
      city: "Downtown",
      distance: 0.5,
      coordinates: { lat: 40.7128, lng: -74.006 }, // New York City
    },
    contact: {
      phone: "+1 (555) 123-4567",
      email: "dr.smith@healthcenter.com",
    },
    availability: {
      nextAvailable: "2024-01-15T09:00:00Z",
      schedule: ["Mon-Fri: 9AM-5PM", "Sat: 9AM-1PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_johnson_cardio",
    name: "Dr. Michael Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: 18,
    location: {
      address: "456 Heart Ave, Cardiac Specialists",
      city: "Midtown",
      distance: 1.2,
      coordinates: { lat: 40.7589, lng: -73.9851 }, // Times Square area
    },
    contact: {
      phone: "+1 (555) 234-5678",
      email: "dr.johnson@cardiaccare.com",
    },
    availability: {
      nextAvailable: "2024-01-16T14:30:00Z",
      schedule: ["Mon-Thu: 8AM-6PM", "Fri: 8AM-4PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_brown_pulmo",
    name: "Dr. Emily Brown",
    specialty: "Pulmonologist",
    rating: 4.7,
    experience: 15,
    location: {
      address: "789 Lung Lane, Respiratory Institute",
      city: "Upper West Side",
      distance: 2.1,
      coordinates: { lat: 40.7831, lng: -73.9712 }, // Upper West Side
    },
    contact: {
      phone: "+1 (555) 345-6789",
      email: "dr.brown@respiratorycare.com",
    },
    availability: {
      nextAvailable: "2024-01-17T10:15:00Z",
      schedule: ["Mon-Wed-Fri: 9AM-5PM", "Tue-Thu: 1PM-7PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_davis_neuro",
    name: "Dr. David Davis",
    specialty: "Neurologist",
    rating: 4.9,
    experience: 20,
    location: {
      address: "321 Brain Boulevard, Neuro Center",
      city: "Medical District",
      distance: 1.8,
      coordinates: { lat: 40.7505, lng: -73.9934 }, // Near Columbia University
    },
    contact: {
      phone: "+1 (555) 456-7890",
      email: "dr.davis@neurocenter.com",
    },
    availability: {
      nextAvailable: "2024-01-18T11:00:00Z",
      schedule: ["Mon-Fri: 8AM-4PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_wilson_endo",
    name: "Dr. Lisa Wilson",
    specialty: "Endocrinologist",
    rating: 4.6,
    experience: 14,
    location: {
      address: "654 Hormone Heights, Endocrine Clinic",
      city: "Brooklyn Heights",
      distance: 2.5,
      coordinates: { lat: 40.6892, lng: -73.9942 }, // Brooklyn Heights
    },
    contact: {
      phone: "+1 (555) 567-8901",
      email: "dr.wilson@endocrineclinic.com",
    },
    availability: {
      nextAvailable: "2024-01-19T13:45:00Z",
      schedule: ["Tue-Thu: 9AM-6PM", "Sat: 10AM-2PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_garcia_gastro",
    name: "Dr. Maria Garcia",
    specialty: "Gastroenterologist",
    rating: 4.8,
    experience: 16,
    location: {
      address: "987 Digestive Drive, GI Associates",
      city: "Queens",
      distance: 3.2,
      coordinates: { lat: 40.7282, lng: -73.7949 }, // Queens
    },
    contact: {
      phone: "+1 (555) 678-9012",
      email: "dr.garcia@giassociates.com",
    },
    availability: {
      nextAvailable: "2024-01-20T15:30:00Z",
      schedule: ["Mon-Wed-Fri: 7AM-3PM", "Thu: 12PM-8PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_lee_psych",
    name: "Dr. James Lee",
    specialty: "Psychiatrist",
    rating: 4.7,
    experience: 13,
    location: {
      address: "147 Mental Health Way, Wellness Center",
      city: "Chelsea",
      distance: 1.9,
      coordinates: { lat: 40.7434, lng: -74.0014 }, // Chelsea
    },
    contact: {
      phone: "+1 (555) 789-0123",
      email: "dr.lee@wellnesscenter.com",
    },
    availability: {
      nextAvailable: "2024-01-21T16:00:00Z",
      schedule: ["Mon-Fri: 10AM-6PM", "Evening sessions available"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_taylor_rheum",
    name: "Dr. Jennifer Taylor",
    specialty: "Rheumatologist",
    rating: 4.5,
    experience: 11,
    location: {
      address: "258 Joint Journey, Arthritis Center",
      city: "Bronx",
      distance: 2.8,
      coordinates: { lat: 40.8448, lng: -73.8648 }, // Bronx
    },
    contact: {
      phone: "+1 (555) 890-1234",
      email: "dr.taylor@arthritiscenter.com",
    },
    availability: {
      nextAvailable: "2024-01-22T08:30:00Z",
      schedule: ["Mon-Thu: 8AM-5PM", "Fri: 8AM-12PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_anderson_allergy",
    name: "Dr. Robert Anderson",
    specialty: "Allergist",
    rating: 4.6,
    experience: 9,
    location: {
      address: "369 Allergy Alley, Immunology Institute",
      city: "Staten Island",
      distance: 4.3,
      coordinates: { lat: 40.5795, lng: -74.1502 }, // Staten Island
    },
    contact: {
      phone: "+1 (555) 901-2345",
      email: "dr.anderson@immunologyinstitute.com",
    },
    availability: {
      nextAvailable: "2024-01-23T12:00:00Z",
      schedule: ["Tue-Sat: 9AM-5PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_white_uro",
    name: "Dr. Susan White",
    specialty: "Urologist",
    rating: 4.7,
    experience: 17,
    location: {
      address: "741 Kidney Court, Urology Center",
      city: "Long Island City",
      distance: 3.5,
      coordinates: { lat: 40.7505, lng: -73.9342 }, // Long Island City
    },
    contact: {
      phone: "+1 (555) 012-3456",
      email: "dr.white@urologycenter.com",
    },
    availability: {
      nextAvailable: "2024-01-24T14:15:00Z",
      schedule: ["Mon-Fri: 7AM-4PM"],
    },
    image: "/placeholder.svg",
  },
  // Adding more doctors for better variety
  {
    id: "dr_patel_dermato",
    name: "Dr. Priya Patel",
    specialty: "Dermatologist",
    rating: 4.8,
    experience: 10,
    location: {
      address: "852 Skin Care Street, Dermatology Center",
      city: "Midtown East",
      distance: 1.1,
      coordinates: { lat: 40.7516, lng: -73.9755 }, // Midtown East
    },
    contact: {
      phone: "+1 (555) 111-2222",
      email: "dr.patel@skincenter.com",
    },
    availability: {
      nextAvailable: "2024-01-25T09:30:00Z",
      schedule: ["Mon-Fri: 9AM-6PM", "Sat: 9AM-2PM"],
    },
    image: "/placeholder.svg",
  },
  {
    id: "dr_rodriguez_ortho",
    name: "Dr. Carlos Rodriguez",
    specialty: "Orthopedist",
    rating: 4.9,
    experience: 22,
    location: {
      address: "963 Bone Boulevard, Sports Medicine",
      city: "Financial District",
      distance: 2.3,
      coordinates: { lat: 40.7074, lng: -74.0113 }, // Financial District
    },
    contact: {
      phone: "+1 (555) 333-4444",
      email: "dr.rodriguez@sportsmed.com",
    },
    availability: {
      nextAvailable: "2024-01-26T08:00:00Z",
      schedule: ["Mon-Fri: 8AM-5PM", "Emergency on-call"],
    },
    image: "/placeholder.svg",
  },
];

export const getDoctorsBySpecialty = (specialty: string) => {
  return doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(specialty.toLowerCase()),
  );
};

// Enhanced function to get nearby doctors with real distance calculation
export const getNearbyDoctors = (
  userLat: number,
  userLng: number,
  maxDistance: number = 5,
) => {
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return doctors
    .map((doctor) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        doctor.location.coordinates.lat,
        doctor.location.coordinates.lng,
      );

      return {
        ...doctor,
        location: { ...doctor.location, distance },
      };
    })
    .filter((doctor) => doctor.location.distance <= maxDistance)
    .sort((a, b) => a.location.distance - b.location.distance);
};

export const getDoctorById = (id: string) => {
  return doctors.find((doctor) => doctor.id === id);
};

// Get doctors by rating
export const getTopRatedDoctors = (limit: number = 5) => {
  return [...doctors].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

// Search doctors by name or specialty
export const searchDoctors = (query: string) => {
  const searchTerm = query.toLowerCase();
  return doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctor.specialty.toLowerCase().includes(searchTerm) ||
      doctor.location.city.toLowerCase().includes(searchTerm),
  );
};
