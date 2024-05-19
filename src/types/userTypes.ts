export default interface UserType {
	id: string;
	name: string;
	email: string;
	isVerified: boolean;
	imageProfile: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;
	preference: {
		dashboard: {
			id: string;
			name: string;
			createdAt: Date;
			updatedAt: Date;
		},
		language: string;
		theme: string;
	}
}