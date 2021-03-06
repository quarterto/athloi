const clone = src => JSON.parse(JSON.stringify(src));

const targetProperties = ['dependencies', 'peerDependencies'];

// link: specifiers are used by Yarn and should be supported by npm in future
// workspace: specifiers are used by Yarn and pnpm
// portal: specifiers are used by Yarn 2 (a.k.a Berry)
const targetSpecifiers = /^(file|link|workspace|portal):/;

module.exports = (manifest, packagesToUpdate, number, fallbackVersions) => {
	const pkg = clone(manifest);

	pkg.version = number;

	targetProperties.forEach(targetProperty => {
		const dependencies = pkg[targetProperty] || {};
		const dependencyNames = Object.keys(dependencies);

		dependencyNames.forEach(dependencyName => {
			const version = dependencies[dependencyName];

			// Only update dependency version of dependencies specified with a local path
			if (targetSpecifiers.test(version)) {
				if (packagesToUpdate.has(dependencyName)) {
					dependencies[dependencyName] = `^${number}`;
				} else if (fallbackVersions.has(dependencyName)) {
					dependencies[dependencyName] = `^${fallbackVersions.get(
						dependencyName,
					)}`;
				} else {
					// Don't allow packages to depend on unpublished packages
					throw new Error(
						`No suitable version found for ${dependencyName} package`,
					);
				}
			}
		});
	});

	return pkg;
};
