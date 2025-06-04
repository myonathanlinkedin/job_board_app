export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export class Location {
  city?: string;
  country?: string;
  isRemote: boolean;

  constructor({ city, country, isRemote }: { city?: string; country?: string; isRemote: boolean }) {
    this.city = city;
    this.country = country;
    this.isRemote = isRemote;
  }

  toString(): string {
    if (this.isRemote) {
      return 'Remote';
    }
    
    if (this.city && this.country) {
      return `${this.city}, ${this.country}`;
    }
    
    return this.country || this.city || '';
  }
} 