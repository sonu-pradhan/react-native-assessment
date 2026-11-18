import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user, signOut } = useAuth();

    if (!user) return null;

    const initials = user.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.brand}>hb+</Text>

                    <View style={styles.headerRight}>
                        <Text style={styles.headerLabel}>
                            MEMBER PORTAL
                        </Text>

                        <View style={styles.headerAvatar}>
                            <Text style={styles.headerAvatarText}>
                                {initials}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.welcomeSection}>
                    <Text style={styles.eyebrow}>
                        YOUR PERSONAL SPACE
                    </Text>

                    <Text style={styles.heading}>
                        Welcome back, {user.name.split(" ")[0]}.
                    </Text>

                    <Text style={styles.subtitle}>
                        Your HB+ account, all in one place.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            Your profile
                        </Text>

                        <View style={styles.verifiedBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.verifiedText}>
                                Verified
                            </Text>
                        </View>
                    </View>

                    <View style={styles.profileSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {initials}
                            </Text>
                        </View>

                        <View style={styles.profileDetails}>
                            <Text style={styles.userName}>
                                {user.name}
                            </Text>

                            <Text style={styles.userEmail}>
                                {user.email}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionLabel}>
                        ACCOUNT INFORMATION
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Account status
                        </Text>
                        <Text style={styles.infoValue}>
                            {user.status}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Organization
                        </Text>
                        <Text style={styles.infoValue}>
                            {user.organization}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Access
                        </Text>
                        <Text style={styles.infoValue}>
                            Authorized
                        </Text>
                    </View>
                </View>

                <View style={styles.wellnessCard}>
                    <Text style={styles.wellnessTitle}>
                        Your wellness, in balance.
                    </Text>

                    <Text style={styles.wellnessDescription}>
                        Body, Gut and Mind — three pillars
                        of a healthier you.
                    </Text>

                    <View style={styles.pillars}>
                        {["Body", "Gut", "Mind"].map((item) => (
                            <View key={item} style={styles.pillar}>
                                <Text style={styles.pillarText}>
                                    {item}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={signOut}
                    accessibilityRole="button"
                >
                    <Text style={styles.logoutText}>
                        Log out
                    </Text>
                </Pressable>

                <Text style={styles.footer}>
                    © HB+ · Member Portal
                </Text>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
        gap: SPACING.lg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    brand: {
        fontSize: 34,
        fontWeight: "800",
        letterSpacing: -2,
        color: COLORS.primary,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerLabel: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.5,
        color: COLORS.muted,
    },
    headerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: COLORS.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    headerAvatarText: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: 13,
    },
    welcomeSection: {
        marginTop: SPACING.md,
        gap: 6,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2,
        color: COLORS.muted,
    },
    heading: {
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "700",
        letterSpacing: -0.8,
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.muted,
        lineHeight: 22,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.primary,
    },
    verifiedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EDF5ED",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: COLORS.success,
    },
    verifiedText: {
        color: COLORS.success,
        fontSize: 11,
        fontWeight: "600",
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.md,
        paddingVertical: 6,
    },
    avatar: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: COLORS.secondary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
    },
    profileDetails: {
        flex: 1,
        gap: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    userEmail: {
        fontSize: 13,
        color: COLORS.muted,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.5,
        color: COLORS.muted,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLabel: {
        fontSize: 13,
        color: COLORS.muted,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.text,
    },
    wellnessCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: 16,
        padding: SPACING.lg,
        gap: 12,
    },
    wellnessTitle: {
        fontSize: 19,
        fontWeight: "700",
        color: COLORS.primary,
    },
    wellnessDescription: {
        fontSize: 13,
        lineHeight: 21,
        color: COLORS.text,
    },
    pillars: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    pillar: {
        flex: 1,
        paddingVertical: 11,
        alignItems: "center",
        backgroundColor: "#F5F3EC",
        borderRadius: 9,
    },
    pillarText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: "600",
    },
    logoutButton: {
        minHeight: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    logoutText: {
        color: COLORS.surface,
        fontSize: 14,
        fontWeight: "600",
    },
    buttonPressed: {
        opacity: 0.75,
    },
    footer: {
        textAlign: "center",
        color: COLORS.muted,
        fontSize: 11,
    },
});