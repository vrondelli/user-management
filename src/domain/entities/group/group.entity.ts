export type GroupConfig = {
  [key: string]: any;
  sessionTime?: number;
  newUserGroupName?: string;
};

export class Group {
  public readonly id: string;
  public readonly name: string;
  public readonly parent?: Group;
  public readonly config: GroupConfig;

  constructor({
    id,
    name,
    config,
    parent,
  }: {
    id: string;
    name: string;
    config: Record<string, any>;
    parent?: Group;
  }) {
    this.id = id;
    this.name = name;
    this.config = config;
    this.parent = parent;
  }

  private mergeConfigs(
    parentConfig: GroupConfig,
    childConfig: GroupConfig,
  ): GroupConfig {
    const result = { ...parentConfig };
    for (const key in childConfig) {
      if (
        childConfig[key] &&
        typeof childConfig[key] === 'object' &&
        !Array.isArray(childConfig[key])
      ) {
        result[key] = this.mergeConfigs(
          parentConfig[key] || {},
          childConfig[key],
        );
      } else {
        result[key] = childConfig[key];
      }
    }
    return result;
  }

  private getAllHierarchyConfigs(): GroupConfig[] {
    const configs: GroupConfig[] = [];
    let currentGroup: Group | undefined = this;

    while (currentGroup) {
      configs.unshift(currentGroup.config);
      currentGroup = currentGroup.parent;
    }

    return configs;
  }

  getConfig(): GroupConfig {
    const configs = this.getAllHierarchyConfigs();
    let mergedConfig: GroupConfig = {};

    for (const config of configs) {
      mergedConfig = this.mergeConfigs(mergedConfig, config);
    }

    return mergedConfig;
  }
}
