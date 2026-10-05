import { TestBed } from '@angular/core/testing';
import { ProfileInformationService } from './profile-information';

describe('ProfileInformationService', () => {
  let service: ProfileInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileInformationService],
    });
    service = TestBed.inject(ProfileInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProfileInformation', () => {
    it('should return profile information with valid fields', async () => {
      const profile = await service.getProfileInformation();

      expect(profile).toBeDefined();
      expect(profile.userName).toBeDefined();
      expect(profile.firstName).toBeDefined();
      expect(profile.lastName).toBeDefined();
      expect(profile.email).toBeDefined();
      expect(profile.phone).toBeDefined();
    });
  });
});
