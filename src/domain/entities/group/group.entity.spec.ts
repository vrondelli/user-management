import { Group } from './group.entity';

describe('Group Entity', () => {
  it('should create a group with the given properties', () => {
    const group = new Group({
      id: '1',
      name: 'Group 1',
      config: { sessionTime: 30 },
    });

    expect(group.id).toBe('1');
    expect(group.name).toBe('Group 1');
    expect(group.getConfig()).toEqual({ sessionTime: 30 });
  });

  it('should merge parent and child configs correctly', () => {
    const parentGroup = new Group({
      id: '1',
      name: 'Parent Group',
      config: { sessionTime: 30, theme: 'dark' },
    });

    const childGroup = new Group({
      id: '2',
      name: 'Child Group',
      config: { theme: 'light', language: 'en' },
      parent: parentGroup,
    });

    expect(childGroup.getConfig()).toEqual({
      sessionTime: 30,
      theme: 'light',
      language: 'en',
    });
  });

  it('should handle deeply nested configs', () => {
    const parentGroup = new Group({
      id: '1',
      name: 'Parent Group',
      config: {
        settings: {
          validGroups: ['testGroup'],
          notifications: { email: true },
        },
      },
    });

    const childGroup = new Group({
      id: '2',
      name: 'Child Group',
      config: {
        settings: { validRoles: ['testRole'], notifications: { sms: true } },
      },
      parent: parentGroup,
    });

    expect(childGroup.getConfig()).toEqual({
      settings: {
        validGroups: ['testGroup'],
        validRoles: ['testRole'],
        notifications: {
          email: true,
          sms: true,
        },
      },
    });
  });

  it('should return only the child config if no parent exists', () => {
    const group = new Group({
      id: '1',
      name: 'Group 1',
      config: { sessionTime: 45 },
    });

    expect(group.getConfig()).toEqual({ sessionTime: 45 });
  });

  it('should handle empty configs gracefully', () => {
    const parentGroup = new Group({
      id: '1',
      name: 'Parent Group',
      config: {},
    });

    const childGroup = new Group({
      id: '2',
      name: 'Child Group',
      config: {},
      parent: parentGroup,
    });

    expect(childGroup.getConfig()).toEqual({});
  });

  it('should override parent config with child config values', () => {
    const parentGroup = new Group({
      id: '1',
      name: 'Parent Group',
      config: { sessionTime: 30 },
    });

    const childGroup = new Group({
      id: '2',
      name: 'Child Group',
      config: { sessionTime: 60 },
      parent: parentGroup,
    });

    expect(childGroup.getConfig()).toEqual({ sessionTime: 60 });
  });
});
