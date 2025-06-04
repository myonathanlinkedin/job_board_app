import { Location, JobType } from '../value-objects';

describe('Location', () => {
  it('should create a location with all properties', () => {
    const location = new Location({
      city: 'New York',
      country: 'USA',
      isRemote: false
    });

    expect(location.city).toBe('New York');
    expect(location.country).toBe('USA');
    expect(location.isRemote).toBe(false);
  });

  it('should return "Remote" string when location is remote', () => {
    const location = new Location({ isRemote: true });

    expect(location.toString()).toBe('Remote');
  });

  it('should return city and country when both are provided', () => {
    const location = new Location({
      city: 'Berlin',
      country: 'Germany',
      isRemote: false
    });

    expect(location.toString()).toBe('Berlin, Germany');
  });

  it('should return country when only country is provided', () => {
    const location = new Location({
      country: 'France',
      isRemote: false
    });

    expect(location.toString()).toBe('France');
  });

  it('should return city when only city is provided', () => {
    const location = new Location({
      city: 'Tokyo',
      isRemote: false
    });

    expect(location.toString()).toBe('Tokyo');
  });

  it('should return empty string when no city, country, and not remote', () => {
    const location = new Location({ isRemote: false });

    expect(location.toString()).toBe('');
  });
});

describe('JobType', () => {
  it('should have the correct enum values', () => {
    expect(JobType.FULL_TIME).toBe('FULL_TIME');
    expect(JobType.PART_TIME).toBe('PART_TIME');
    expect(JobType.CONTRACT).toBe('CONTRACT');
    expect(JobType.INTERNSHIP).toBe('INTERNSHIP');
    expect(JobType.FREELANCE).toBe('FREELANCE');
  });
}); 